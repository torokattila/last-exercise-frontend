import ExerciseType from "../../models/ExerciseType";

interface ExercisePayload {
  name: string;
  cardColor: string;
  textColor: string;
  duration: string;
  intervalNotificationTime: string;
  exerciseTypes: Partial<ExerciseType>[];
  order: number | string;
  userId: number;
}

export default ExercisePayload