import { useUserPreference } from '../contexts/UserContext';

export type DontAskAgainList = Array<{ action: string; label: string }>

export const useDontAskAgain = (action: string): boolean => {
	const dontAskAgainList = useUserPreference<DontAskAgainList>('dontAskAgainList');
	const shouldNotAskAgain = !!dontAskAgainList?.filter(({ action: currentAction }) => action === currentAction).length;

	return shouldNotAskAgain;
};
