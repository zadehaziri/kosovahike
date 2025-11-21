export const isUserAlreadyJoined = (eventsAttendees, userId) => {
  let tempAttendees = eventsAttendees || [];

  if (tempAttendees.length === 0) return true;

  const filteredTempAttendees = tempAttendees.filter(
    (attItem) => attItem._id === userId
  );

  return filteredTempAttendees.length > 0;
};
