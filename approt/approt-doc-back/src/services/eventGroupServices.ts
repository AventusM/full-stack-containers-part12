import EventGroup from "../models/eventGroup";

import {
  BaseEventGroupObject,
  MongooseEventGroupObject,
  MongooseEventObject,
  MongooseUserObject,
  ParticipationErrorType,
  ServiceError,
} from "../types";
import {
  EMPTY_ARRAY,
  EVENTS_FIELD,
  EVENTS_PARTICIPANTS_FIELD,
  EVENT_HOST_FIELD,
  PICK_FIELD,
} from "../constants";

const getAll = async (): Promise<MongooseEventGroupObject[]> => {
  const allEventGroups = await EventGroup.find({})
    .populate(EVENTS_PARTICIPANTS_FIELD, { username: PICK_FIELD })
    .populate(EVENTS_FIELD, { name: PICK_FIELD, point: PICK_FIELD })
    .populate(EVENT_HOST_FIELD, { username: PICK_FIELD });
  return allEventGroups;
};

const findEventGroup = async (
  id: string
): Promise<MongooseEventGroupObject | null> => {
  const foundEventGroup = await EventGroup.findById(id)
    .populate(EVENTS_PARTICIPANTS_FIELD, { username: PICK_FIELD })
    .populate(EVENTS_FIELD, { name: PICK_FIELD, point: PICK_FIELD })
    .populate(EVENT_HOST_FIELD, { username: PICK_FIELD });
  return foundEventGroup;
};

const createEventGroup = async (
  basicEventData: Pick<BaseEventGroupObject, "name" | "startDate" | "endDate">,
  host: MongooseUserObject,
  events: MongooseEventObject[]
): Promise<MongooseEventGroupObject> => {
  const isDuplicateName = await EventGroup.find({ name: basicEventData.name });
  if (isDuplicateName.length > 0) {
    throw new Error(
      "Duplicate event name found! TODO: Check if unique names are needed"
    );
  }

  const newEventGroup = await EventGroup.create({
    name: basicEventData.name,
    startDate: basicEventData.startDate,
    endDate: basicEventData.endDate,
    host,
    events,
    participants: EMPTY_ARRAY,
  });

  return newEventGroup;
};

const addUserToEventGroup = async (
  eventGroup: MongooseEventGroupObject,
  user: MongooseUserObject
): Promise<MongooseEventGroupObject | ServiceError> => {
  const userIsAlreadyRegistered = eventGroup.participants.find(
    (participantData) => {
      const stringParticipantId = participantData.id?.toString();
      const stringUserId = user.id?.toString();
      const match = stringParticipantId === stringUserId;
      return match;
    }
  );

  if (userIsAlreadyRegistered) {
    return {
      kind: ParticipationErrorType.add_error,
      message: "User already registered to the event group",
    };
  }

  eventGroup.participants = eventGroup.participants.concat(user._id);
  user.approParticipations = user.approParticipations.concat(eventGroup._id);
  const updatedEventGroup = await eventGroup.save();
  await user.save();
  return updatedEventGroup;
};

// TODO: Edge & Error cases
const removeUserFromEventGroup = async (
  eventGroup: MongooseEventGroupObject,
  user: MongooseUserObject
): Promise<MongooseEventGroupObject> => {
  eventGroup.participants = eventGroup.participants.filter(
    (participant) => participant.id?.toString() !== user.id?.toString()
  );

  user.approParticipations = user.approParticipations.filter(
    (singleAppro) => singleAppro.id?.toString() !== eventGroup.id?.toString()
  );

  const updatedEventGroup = await eventGroup.save();
  await user.save();
  return updatedEventGroup;
};

export default {
  getAll,
  createEventGroup,
  findEventGroup,
  addUserToEventGroup,
  removeUserFromEventGroup,
};
