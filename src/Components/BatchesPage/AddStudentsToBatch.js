import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import axios from "../AxiosInterceptor/AxiosInterceptor";
import useErrorMessageHandler from "../../CustomHooks/ErrorMessageHandler";
import useDialogBoxHandler from "../../CustomHooks/DialogBoxHandler";
import MultipleDropdown from "../MultipleDropdown/MultipleDropdown";
import "../../ComponetsStyles/CreateForm.css";

const AddStudentsToBatch = ({ batchId, batchName, onStudentsAdded, currentStudentCount }) => {
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedStudentDetails, setSelectedStudentDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingStudents, setIsFetchingStudents] = useState(false);
    const [error, setError] = useState("");

    const { handleErrorMessage } = useErrorMessageHandler();
    const { showDialogBox } = useDialogBoxHandler();

    const MAX_STUDENTS_PER_BATCH = 24;

    useEffect(() => {
        if (!batchId) return;
        fetchAvailableStudents();
    }, [batchId]);

    const fetchAvailableStudents = async () => {
        try {
            setIsFetchingStudents(true);
            setError("");

            const response = await axios.get(process.env.REACT_APP_BATCHES_AVAILABLE_STUDENTS_API_URL);
            const studentsData = Array.isArray(response.data) ? response.data : [];

            setAvailableStudents(studentsData);
            setSelectedStudentDetails([]);
        } catch (fetchError) {
            handleErrorMessage();
        } finally {
            setIsFetchingStudents(false);
        }
    };

    const dropdownValues = useMemo(
        () => availableStudents.map((student) => student.studentDetails),
        [availableStudents]
    );

    const selectedStudents = useMemo(() => {
        const selectedSet = new Set(selectedStudentDetails);
        return availableStudents.filter((student) => selectedSet.has(student.studentDetails));
    }, [availableStudents, selectedStudentDetails]);

    const proceedAddStudents = async (studentIds) => {
        try {
            setIsLoading(true);
            setError("");

            const response = await axios.put(
                `${process.env.REACT_APP_BATCHES_ADD_STUDENT_API_URL}/${batchId}`,
                { id: studentIds }
            );

            if (response.data?.message && response.data.message !== "Students added successfully") {
                setError(response.data.message);
                return;
            }

            showDialogBox({
                showButtons: true,
                dialogTextTitle: "Success",
                dialogTextContent: `${selectedStudents.map((student) => student.studentDetails).join(",")} added successfully!`,
                dialogTextButton: "OK",
                showDefaultButton: true
            });

            await fetchAvailableStudents();
            onStudentsAdded?.();
        } catch (addError) {
            setError("Failed to add students");
            handleErrorMessage();
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddStudents = async () => {
        if (selectedStudents.length === 0) {
            setError("Please select at least one student");
            return;
        }

        const newTotal = currentStudentCount + selectedStudents.length;
        const studentIds = selectedStudents.map((student) => student.id);

        if (newTotal > MAX_STUDENTS_PER_BATCH) {
            showDialogBox({
                showButtons: true,
                dialogTextTitle: "Exceed Limit",
                dialogTextContent: `Adding ${selectedStudents.length} will exceed ${MAX_STUDENTS_PER_BATCH}. Continue?`,
                showCancelBtn: true,
                dialogTextButtonOnConfirm: "Continue",
                clickFunctionsOnConfirmFunction: () => proceedAddStudents(studentIds)
            });
            return;
        }

        await proceedAddStudents(studentIds);
    };

    return (
        <section className="vh-200">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">

                    <div
                        className="formDiv"
                        style={{
                            width: "100%",
                            maxWidth: "420px",
                            flex: "0 0 420px",
                            margin: "0 auto"
                        }}
                    >
                        <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                            <div className="card-body text-center" style={{ padding: "20px" }}>
                                <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                                    ADD STUDENTS
                                </p>
                                <hr />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {batchName}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                    Students: <strong>{currentStudentCount}/{MAX_STUDENTS_PER_BATCH}</strong>
                                </Typography>
                                {error && <Alert severity="error">{error}</Alert>}
                                {isFetchingStudents ? (
                                    <CircularProgress />
                                ) : availableStudents.length > 0 ? (
                                    <>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                maxWidth: "100%",
                                                margin: "0 auto"
                                            }}
                                        >
                                            <div className="row" style={{ justifyContent: "center" }}>
                                                <MultipleDropdown
                                                    values={dropdownValues}
                                                    selectedValues={selectedStudentDetails}
                                                    setSelectedValues={(values) => {
                                                        setSelectedStudentDetails(values);
                                                        setError("");
                                                    }} />
                                            </div>
                                            <Box
                                                sx={{
                                                    mt: 3,
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    px: 1
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    onClick={handleAddStudents}
                                                    disabled={isLoading || selectedStudents.length === 0}
                                                    sx={{
                                                        height: 40,
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    {isLoading ? "Adding..." : "Add Students"}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setSelectedStudentDetails([]);
                                                        setError("");
                                                    }}
                                                    disabled={isLoading}
                                                    sx={{
                                                        height: 40,
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    Clear
                                                </Button>
                                            </Box>
                                        </Box>
                                    </>
                                ) : (
                                    <Alert severity="info">No students available</Alert>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AddStudentsToBatch;
