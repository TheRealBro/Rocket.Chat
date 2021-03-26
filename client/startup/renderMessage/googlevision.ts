import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { callbacks } from '../../../app/callbacks/client';
import { settings } from '../../../app/settings/client';

Meteor.startup(() => {
	Tracker.autorun(() => {
		const isEnabled = settings.get('GoogleVision_Enable');

		if (!isEnabled) {
			callbacks.remove('renderMessage', 'googlevision');
			return;
		}

		import('../../../app/google-vision/client').then(
			({ createGoogleVisionMessageRenderer }) => {
				const renderMessage = createGoogleVisionMessageRenderer();
				callbacks.remove('renderMessage', 'googlevision');
				callbacks.add(
					'renderMessage',
					renderMessage,
					callbacks.priority.HIGH - 3,
					'googlevision',
				);
			},
		);
	});
});
