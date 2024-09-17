import db from "../db";

interface LessonUserMapping {
    lesson_id: number;
    user_id: number;
}

export const addLessonsForUsers = async (referrerId: number, inviteeId: number) => {
    const lessonContents = [
        "Lesson 1: Introduction to the Course",
        "Lesson 2: Understanding Basics",
        "Lesson 3: Advanced Topics",
        "Lesson 4: Final Project"
    ];

    // Creating lessons in table lessons
    const lessonsIds = await db('lessons')
        .insert(lessonContents.map((title) => ({ title, content: `${title} content` })))
        .returning('id');

    const lessonUserMappings: LessonUserMapping[] = lessonsIds.flatMap((lesson: { id: number }) => [
        { lesson_id: lesson.id, user_id: referrerId },
        { lesson_id: lesson.id, user_id: inviteeId },
    ]);

    await db('lesson_user').insert(lessonUserMappings);
};
