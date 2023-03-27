export interface LearningClassViewModel {
    learningClasses: LearningClassListItem[],
    totalData: number
};

export interface LearningClassListItem {
    learningClassId: string,
    lecturerName: string,
    subject: string,
    startDate: string,
    finishDate: string
};