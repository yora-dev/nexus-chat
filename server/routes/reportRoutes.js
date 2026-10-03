import { Report } from '../models/Report.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const createReport = asyncHandler(async (req, res) => {
  const { reportedUser, reportedMessage, reason, description } = req.body;
  const report = await Report.create({
    reporter: req.user._id,
    reportedUser,
    reportedMessage,
    reason,
    description
  });
  return ApiResponse.success(res, 201, 'Report submitted successfully', { report });
});

export default createReport;