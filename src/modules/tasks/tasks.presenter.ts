type PracticeTaskView = {
  id: string;
  userId: string;
  cohortId: string;
  date: Date;
  title: string;
  description: string;
  artifactLink: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const presentPracticeTask = (task: PracticeTaskView) => {
  return {
    ...task,
    date: task.date.toISOString().slice(0, 10),
  };
};

export { presentPracticeTask };
