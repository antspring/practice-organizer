import { RequestHandler } from 'express';

import { asyncHandler } from '../../shared/http/middlewares/asyncHandler';
import { cohortTracksParamsSchema, createTrackSchema, trackIdParamsSchema, updateTrackSchema } from './tracks.schemas';
import { createTrackForAdmin, listCohortTracksForAdmin, updateTrackForAdmin } from './tracks.service';

const createTrack: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = cohortTracksParamsSchema.parse(request.params);
  const data = createTrackSchema.parse(request.body);
  const result = await createTrackForAdmin(cohortId, data);

  response.status(201).json(result);
});

const listCohortTracks: RequestHandler = asyncHandler(async (request, response) => {
  const { cohortId } = cohortTracksParamsSchema.parse(request.params);
  const result = await listCohortTracksForAdmin(cohortId);

  response.status(200).json(result);
});

const updateTrack: RequestHandler = asyncHandler(async (request, response) => {
  const { id } = trackIdParamsSchema.parse(request.params);
  const data = updateTrackSchema.parse(request.body);
  const result = await updateTrackForAdmin(id, data);

  response.status(200).json(result);
});

export { createTrack, listCohortTracks, updateTrack };
