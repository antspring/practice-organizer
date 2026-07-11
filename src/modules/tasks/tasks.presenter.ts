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

type TaskParticipantView = {
  userId: string;
  track: {
    id: string;
    title: string;
  } | null;
  user: {
    practiceProfile: {
      fullName: string | null;
    } | null;
    practiceTasks: PracticeTaskView[];
  };
};

const presentTaskParticipant = (participant: TaskParticipantView) => {
  return {
    userId: participant.userId,
    fullName: participant.user.practiceProfile?.fullName ?? null,
    track: participant.track,
    tasks: participant.user.practiceTasks.map(presentPracticeTask),
  };
};

export { presentPracticeTask, presentTaskParticipant };
