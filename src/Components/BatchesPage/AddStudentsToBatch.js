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
                    <div className="formDiv">
                        <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                            <div className="card-body p-5 text-center">
                                <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>ADD STUDENTS</p>
                                <hr />

                                <Typography variant="body2">
                                    Batch: <strong>{batchName}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                    Students: <strong>{currentStudentCount}/{MAX_STUDENTS_PER_BATCH}</strong>
                                </Typography>

                                {error && <Alert severity="error">{error}</Alert>}

                                {isFetchingStudents ? (
                                    <CircularProgress />
                                ) : availableStudents.length > 0 ? (
                                    <>
                                        <div className="row" style={{ justifyContent: "center" }}>
                                            <MultipleDropdown
                                                values={dropdownValues}
                                                selectedValues={selectedStudentDetails}
                                                setSelectedValues={(values) => {
                                                    setSelectedStudentDetails(values);
                                                    setError("");
                                                }}
                                            />
                                        </div>

                                        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
                                            <Button
                                                variant="contained"
                                                onClick={handleAddStudents}
                                                disabled={isLoading || selectedStudents.length === 0}
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
                                            >
                                                Clear
                                            </Button>
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
