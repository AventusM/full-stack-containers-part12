import {
  EMPTY_ARRAY,
  EVENTS_COMPLETED_PARTICIPANTS_FIELD,
  EVENTS_PARTICIPANTS_FIELD,
  PICK_FIELD,
} from "../constants";
import Event from "../models/event";
import {
  BaseEventObject,
  MongooseEventObject,
  MongooseUserObject,
  ParticipationErrorType,
  ServiceError,
} from "../types";

const getAll = async (): Promise<MongooseEventObject[]> => {
  const allEvents = await Event.find({})
    .populate(EVENTS_PARTICIPANTS_FIELD, {
      username: PICK_FIELD,
    })
    .populate(EVENTS_COMPLETED_PARTICIPANTS_FIELD, { username: PICK_FIELD });
  return allEvents;
};

const createEvent = async (
  event: BaseEventObject
): Promise<MongooseEventObject> => {
  const newEvent = await Event.create({
    name: event.name,
    location: event.location,
    point: event.point,
    participants: EMPTY_ARRAY, // Initially empty
    completedParticipants: EMPTY_ARRAY, // Initially empty
  });

  return newEvent;
};

const findEventByName = async (
  name: string
): Promise<MongooseEventObject | null> => {
  const foundEvent = await Event.findOne({ name }).exec();
  return Promise.resolve(foundEvent);
};

const findEvent = async (
  eventId: string
): Promise<MongooseEventObject | null> => {
  const foundEvent = await Event.findById(eventId)
    .populate(EVENTS_PARTICIPANTS_FIELD, { username: PICK_FIELD })
    .populate(EVENTS_COMPLETED_PARTICIPANTS_FIELD, { username: PICK_FIELD });
  return foundEvent;
};

const addUserToEvent = async (
  event: MongooseEventObject,
  user: MongooseUserObject
): Promise<MongooseEventObject | ServiceError> => {
  // Do not allow multiple registrations to a single event by a user
  // non-populated participants data --> participants consist of participant id's by default
  const userIsAlreadyRegistered = event.participants.find((participantData) => {
    const stringParticipantId = participantData.id?.toString();
    const stringUserId = user.id?.toString();
    const match = stringParticipantId === stringUserId;
    return match;
  });

  if (userIsAlreadyRegistered) {
    return {
      kind: ParticipationErrorType.add_error,
      message: "User already registered to the event",
    };
  }

  event.participants = event.participants.concat(user._id); // User to the specific event
  const updatedEvent = await event.save();
  return updatedEvent;
};

const completeEvent = async (
  event: MongooseEventObject,
  user: MongooseUserObject
): Promise<MongooseEventObject | ServiceError> => {
  const userParticipating = event.participants.find((participantData) => {
    const stringParticipantId = participantData.id?.toString();
    const stringUserId = user.id?.toString();
    const match = stringParticipantId === stringUserId;

    return match;
  });

  // Allow user to have 1 completion per event
  // non-populated participants data --> participants consist of participant id's by default
  const userHasAlreadyCompletedEvent = event.completedParticipants.find(
    (participantData) => {
      const stringParticipantId = participantData.id?.toString();
      const stringUserId = user.id?.toString();
      const match = stringParticipantId === stringUserId;

      return match;
    }
  );

  if (!userParticipating) {
    return {
      kind: ParticipationErrorType.complete_error,
      message: "User not in participants list!",
    };
  }

  if (userHasAlreadyCompletedEvent) {
    return {
      kind: ParticipationErrorType.complete_error,
      message: "User has already finished the event!",
    };
  }

  event.completedParticipants = event.completedParticipants.concat(user._id); // User to the list of finished participants
  const updatedEvent = await event.save();
  return updatedEvent;
};

const removeUserFromEvent = async (
  event: MongooseEventObject,
  user: MongooseUserObject
): Promise<MongooseEventObject | ServiceError> => {
  const userIsAlreadyRegistered = event.participants.find((participantData) => {
    const stringParticipantId = participantData.id?.toString();
    const stringUserId = user.id?.toString();
    const match = stringParticipantId === stringUserId;

    return match;
  });

  const userHasAlreadyCompletedEvent = event.completedParticipants.find(
    (participantData) => {
      const stringParticipantId = participantData.id?.toString();
      const stringUserId = user.id?.toString();
      const match = stringParticipantId === stringUserId;

      return match;
    }
  );

  // Remove only if participating AND hasn't yet completed the event
  if (!userIsAlreadyRegistered) {
    return {
      kind: ParticipationErrorType.remove_error,
      message: "User isnt registered to the event!",
    };
  }

  if (userHasAlreadyCompletedEvent) {
    return {
      kind: ParticipationErrorType.remove_error,
      message: "User has already finished the event!",
    };
  }

  event.participants = event.participants.filter(
    (participantData) => participantData.id?.toString() !== user.id?.toString()
  );

  const updatedEventData = await event.save();
  return updatedEventData;
};

const deleteEvent = async (
  eventId: string
): Promise<MongooseEventObject | null> => {
  const removedEvent = await Event.findByIdAndRemove(eventId);
  return removedEvent;
};

export default {
  getAll,
  createEvent,
  findEvent,
  addUserToEvent,
  completeEvent,
  removeUserFromEvent,
  deleteEvent,
  findEventByName,
};
