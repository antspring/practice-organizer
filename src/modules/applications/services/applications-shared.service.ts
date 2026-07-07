const isApplicationOpen = (applicationStartsAt: Date, applicationEndsAt: Date) => {
  const now = new Date();

  return applicationStartsAt <= now && applicationEndsAt >= now;
};

export { isApplicationOpen };
