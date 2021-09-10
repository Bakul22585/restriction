export class SmsTable {
	public static sms: any = [
		{
			id: 1,
			name: 'Test',
			desc: 'test',
			handler_name: 'Denish',
			start_datetime: new Date(),
			end_datetime: new Date(),
			place: 'Surat',
			sms: 'test',
			is_active: 1,
			assign_user: [
				{
					id: 3,
					first_name: 'Chetan',
					last_name: 'Nakum',
					email: 'chetan.nakum@gmail.com',
					phone_no: '7845122356',
				}
			],
		},
	];
}
