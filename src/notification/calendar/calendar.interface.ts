import { Logger } from 'winston';

export default interface CalendarService {
  setupCalendar(
    message: string,
    number: string,
    logger?: Logger,
  ): Promise<void>;
}
