export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  ownerId?: string;
  creationTime?: string;
  updateTime?: string;
  enrollmentCode?: string;
  courseState?: "ACTIVE" | "ARCHIVED" | "PROVISIONED" | "DECLINED" | "SUSPENDED";
  alternateLink?: string;
  teacherGroupEmail?: string;
  courseGroupEmail?: string;
  guardiansEnabled?: boolean;
}

export interface ClassroomCourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  state?: "PUBLISHED" | "DRAFT" | "DELETED";
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  dueDate?: {
    year: number;
    month: number;
    day: number;
  };
  dueTime?: {
    hours: number;
    minutes?: number;
  };
  maxPoints?: number;
  workType?: "ASSIGNMENT" | "SHORT_ANSWER_QUESTION" | "MULTIPLE_CHOICE_QUESTION";
  assigneeMode?: "ALL_STUDENTS" | "INDIVIDUAL_STUDENTS";
}

export interface ClassroomAnnouncement {
  id: string;
  courseId: string;
  text: string;
  state?: "PUBLISHED" | "DRAFT" | "DELETED";
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  creatorUserId?: string;
}

export interface ClassroomUser {
  userId: string;
  profile?: {
    name?: {
      fullName?: string;
      givenName?: string;
      familyName?: string;
    };
    emailAddress?: string;
    photoUrl?: string;
  };
}

export async function fetchClassroomCourses(accessToken: string): Promise<ClassroomCourse[]> {
  try {
    const res = await fetch(
      "https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&pageSize=20",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch Google Classroom courses (${res.status})`);
    }

    const data = await res.json();
    return data.courses || [];
  } catch (error) {
    console.error("Error fetching Google Classroom courses:", error);
    throw error;
  }
}

export async function fetchCourseWork(accessToken: string, courseId: string): Promise<ClassroomCourseWork[]> {
  try {
    const res = await fetch(
      `https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/courseWork?orderBy=updateTime desc&pageSize=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch CourseWork (${res.status})`);
    }

    const data = await res.json();
    return data.courseWork || [];
  } catch (error) {
    console.error(`Error fetching CourseWork for course ${courseId}:`, error);
    throw error;
  }
}

export async function fetchAnnouncements(accessToken: string, courseId: string): Promise<ClassroomAnnouncement[]> {
  try {
    const res = await fetch(
      `https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/announcements?orderBy=updateTime desc&pageSize=15`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch Announcements (${res.status})`);
    }

    const data = await res.json();
    return data.announcements || [];
  } catch (error) {
    console.error(`Error fetching Announcements for course ${courseId}:`, error);
    throw error;
  }
}

export async function fetchCourseMembers(
  accessToken: string,
  courseId: string
): Promise<{ students: ClassroomUser[]; teachers: ClassroomUser[] }> {
  try {
    const [studentsRes, teachersRes] = await Promise.all([
      fetch(`https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/students`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(`https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/teachers`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    const studentsData = studentsRes.ok ? await studentsRes.json() : {};
    const teachersData = teachersRes.ok ? await teachersRes.json() : {};

    return {
      students: studentsData.students || [],
      teachers: teachersData.teachers || [],
    };
  } catch (error) {
    console.error("Error fetching course members:", error);
    return { students: [], teachers: [] };
  }
}

export async function postClassroomAnnouncement(
  accessToken: string,
  courseId: string,
  text: string
): Promise<ClassroomAnnouncement> {
  try {
    const res = await fetch(
      `https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/announcements`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          state: "PUBLISHED",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to post announcement (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error posting announcement:", error);
    throw error;
  }
}
