const Notification = require('../models/Notification');

const createNotification = async ({ recipient, type, title, message, relatedJob, relatedApplication }) => {
  try {
    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedJob,
      relatedApplication,
    });
    return notification;
  } catch (error) {
    console.error('[NOTIFICATION SERVICE] Error creating notification:', error.message);
  }
};

const notifyNewJob = async (recipientIds, job) => {
  const promises = recipientIds.map((recipientId) =>
    createNotification({
      recipient: recipientId,
      type: 'new_job',
      title: 'New Job Available',
      message: `A new job "${job.title}" has been posted in ${job.category}.`,
      relatedJob: job._id,
    })
  );
  await Promise.all(promises);
};

const notifyJobAssigned = async (recipientId, job) => {
  await createNotification({
    recipient: recipientId,
    type: 'job_assigned',
    title: 'Job Assigned',
    message: `Your application for "${job.title}" has been accepted!`,
    relatedJob: job._id,
  });
};

const notifyJobCompleted = async (recipientId, job) => {
  await createNotification({
    recipient: recipientId,
    type: 'job_completed',
    title: 'Job Completed',
    message: `The job "${job.title}" has been marked as completed.`,
    relatedJob: job._id,
  });
};

const notifyApplicationUpdate = async (recipientId, application, job) => {
  await createNotification({
    recipient: recipientId,
    type: 'application_update',
    title: 'Application Update',
    message: `Your application for "${job.title}" is now ${application.status}.`,
    relatedJob: job._id,
    relatedApplication: application._id,
  });
};

const notifyJobFilled = async (recipientId, job) => {
  await createNotification({
    recipient: recipientId,
    type: 'application_update',
    title: 'Job Already Filled',
    message: `The job "${job.title}" you applied for has been filled. Keep looking — new jobs are posted daily!`,
    relatedJob: job._id,
  });
};

const notifyConnectionRequest = async (toUserId, fromName) => {
  await createNotification({
    recipient: toUserId,
    type: 'connection_request',
    title: 'New Connection Request',
    message: `${fromName} wants to connect with you.`,
  });
};

const notifyConnectionAccepted = async (toUserId, acceptorName) => {
  await createNotification({
    recipient: toUserId,
    type: 'connection_accepted',
    title: 'Connection Accepted',
    message: `${acceptorName} accepted your connection request.`,
  });
};

module.exports = {
  createNotification,
  notifyNewJob,
  notifyJobAssigned,
  notifyJobCompleted,
  notifyApplicationUpdate,
  notifyJobFilled,
  notifyConnectionRequest,
  notifyConnectionAccepted,
};
