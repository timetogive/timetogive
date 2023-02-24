import { faHouseHeart } from '@fortawesome/pro-solid-svg-icons/faHouseHeart';
import { faPeopleGroup } from '@fortawesome/pro-solid-svg-icons/faPeopleGroup';
import { faHandWave } from '@fortawesome/pro-light-svg-icons/faHandWave';
import { faHandshake } from '@fortawesome/pro-solid-svg-icons/faHandshake';
import { faHandHoldingDollar } from '@fortawesome/pro-solid-svg-icons/faHandHoldingDollar';
import { faMessagesQuestion } from '@fortawesome/pro-solid-svg-icons/faMessagesQuestion';
import { TaskReason } from '../types';

export const getTtgIcon = (reason: string) => {
  switch (reason) {
    case 'Charity':
      return faHouseHeart;
    case 'Community':
      return faPeopleGroup;
    case 'In Need':
      return faHandWave;
    case 'Mutual Benefit':
      return faHandshake;
    case 'Return For Pledge':
      return faHandHoldingDollar;
    case 'Advice':
      return faMessagesQuestion;
    default:
      return faHandWave;
  }
};

export const reasonToTitle = (reason: TaskReason) => {
  switch (reason) {
    case 'Charity':
      return 'Task for charity';
    case 'Community':
      return 'Task for community';
    case 'In Need':
      return 'Task for those in need';
    case 'Mutual Benefit':
      return 'Task for mutual benefit';
    case 'Return For Pledge':
      return 'Task in return for pledge';
    default:
      return 'Task';
  }
};