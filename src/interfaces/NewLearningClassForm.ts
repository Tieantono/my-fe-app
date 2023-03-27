import LecturerDropdownModel from "./LecturerDropdownModel";
import StudentDropdownModel from "./StudentDropdownModel";

export interface NewLearningClassForm {
    learningClassId: string,
    lecturer: LecturerDropdownModel,
    startDate: Date,
    finishDate: Date,
    students: StudentDropdownModel[]
}

export interface NewLearningClassSubmissionData {
    learningClassId: string,
    lecturerId: string,
    startDate: Date,
    finishDate: Date,
    studentIds: string[]
}