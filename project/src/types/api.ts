export interface TeacherRequest {
  topic: string;
  hobby: string;
  question: string;
  advance_topic?: boolean;
}

export interface RelevantTopic {
  unit: string;
  topic: string;
  unit_number: number;
}

export interface TeacherResponse {
  reply: string;
  relevant_topics: RelevantTopic[];
  context_type: string;
  primary_unit?: string;
}