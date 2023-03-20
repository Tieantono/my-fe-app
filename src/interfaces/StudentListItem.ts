export interface StudentViewModel {
    students: StudentListItem[],
    totalData: number
};

export interface StudentListItem {
    studentId: string,
    studentName: string,
    nickname?: string,
    phoneNumber: string,
    joinedAt: string,
    schoolName: string
};