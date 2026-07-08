import { findPracticeProfileByUserId, upsertPracticeProfile } from './profiles.repository';
import { UpdatePracticeProfileInput } from './types/profiles.types';

const getCurrentUserPracticeProfile = async (userId: string) => {
  const profile = await findPracticeProfileByUserId(userId);

  return { profile };
};

const updateCurrentUserPracticeProfile = async (userId: string, input: UpdatePracticeProfileInput) => {
  const profile = await upsertPracticeProfile(userId, input);

  return { profile };
};

export { getCurrentUserPracticeProfile, updateCurrentUserPracticeProfile };
