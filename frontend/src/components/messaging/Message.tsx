import moment from "moment";

interface Props {
	you: boolean;
	content: string;
	profile_picture: string;
	sent_date: string;
}

export default function Message({
	you,
	content,
	profile_picture,
	sent_date
}: Props) {
	return (
		<>
			{!you ? (
				<div className="p-2 flex w-full">
					<img
						src={profile_picture}
						alt="User profile picture"
						className="w-10 h-10 rounded-full border border-black object-cover"
					/>
					<div className="ml-2 mt-2 rounded-tr-lg rounded-br-lg rounded-bl-lg p-2 bg-green-500 text-white">
						{content.startsWith("https://media.tenor.com/") &&
						content.endsWith(".gif") ? (
							<img src={content} alt="gif" />
						) : (
							<p>{content}</p>
						)}
						<div className="float-right">
							<p className="text-xs">
								<i>Sent {moment(sent_date).fromNow()}</i>
							</p>
						</div>
					</div>
				</div>
			) : (
				<div className="p-2 flex w-full justify-end">
					<div className="ml-2 mt-2 rounded-tl-lg rounded-br-lg rounded-bl-lg p-2 bg-blue-500 text-white float-right">
						{content.startsWith("https://media.tenor.com/") &&
						content.endsWith(".gif") ? (
							<img src={content} alt="gif" />
						) : (
							<p>{content}</p>
						)}
						<div className="float-right">
							<p className="text-xs">
								<i>Sent {moment(sent_date).fromNow()}</i>
							</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
