import { Box, CheckBox } from '@rocket.chat/fuselage';
import React, { useState, FC, ReactElement, ComponentType } from 'react';

import { useTranslation } from '../contexts/TranslationContext';
import { useUserPreference } from '../contexts/UserContext';
import { useMethod } from '../contexts/ServerContext';
import { DontAskAgainList } from '../hooks/useDontAskAgain';

type DoNotAskAgainProps = {
	onConfirm: (...args: any) => any;
	dontAskAgain: {
		action: string;
		label: string;
	};
}

export type RequiredModalProps = {
	onConfirm: (...args: any) => any;
	dontAskAgain?: ReactElement;
}

function withDoNotAskAgain<T extends RequiredModalProps>(WrappedComponent: ComponentType<any>): FC<DoNotAskAgainProps & Omit<T, keyof RequiredModalProps>> {
	return function({ onConfirm, dontAskAgain, ...props }): ReactElement {
		const t = useTranslation();
		const dontAskAgainList = useUserPreference<DontAskAgainList>('dontAskAgainList');
		const { action, label } = dontAskAgain;

		const saveFn = useMethod('saveUserPreferences');
		const [state, setState] = useState<boolean>(false);

		const handleConfirm = async (): Promise<void> => {
			try {
				if (state) {
					await saveFn({ dontAskAgainList: [...dontAskAgainList || [], { action, label }] });
				}
				await onConfirm();
			} catch (e) {
				console.error(e);
			}
		};

		const onChange = (): void => {
			setState(!state);
		};

		return <WrappedComponent
			{...props}
			dontAskAgain={
				<Box display='flex' flexDirection='row'>
					<CheckBox checked={state} onChange={onChange} mie='x4' name='dont_ask_again' />
					<label htmlFor='dont_ask_again'>{t('Dont_ask_me_again')}</label>
				</Box>
			}
			onConfirm={handleConfirm}
		/>;
	};
}

export { withDoNotAskAgain };
