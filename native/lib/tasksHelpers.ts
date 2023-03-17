import { faHouseHeart } from '@fortawesome/pro-solid-svg-icons/faHouseHeart';
import { faPeopleGroup } from '@fortawesome/pro-solid-svg-icons/faPeopleGroup';
import { faHandWave } from '@fortawesome/pro-light-svg-icons/faHandWave';
import { faHandshake } from '@fortawesome/pro-solid-svg-icons/faHandshake';
import { faHandHoldingDollar } from '@fortawesome/pro-solid-svg-icons/faHandHoldingDollar';
import { faMessagesQuestion } from '@fortawesome/pro-solid-svg-icons/faMessagesQuestion';
import { TaskReason } from '../types';
import pluralize from 'pluralize';

export const getTtgIcon = (reason: TaskReason) => {
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

export const effortText = (
  days: number,
  hours: number,
  minutes: number
) => {
  const daysText =
    days === 0 ? [] : [`${days} ${pluralize('day', days)}`];
  const hoursText =
    hours === 0 ? [] : [`${hours} ${pluralize('hour', hours)}`];
  const minutesText =
    minutes === 0
      ? []
      : [`${minutes} ${pluralize('minute', minutes)}`];
  const final = [...daysText, ...hoursText, ...minutesText].join(' ');
  return final;
};
