import { IconType } from 'react-icons/lib'

type IconBtnProps = {
	Icon: IconType
	isActive?: boolean
	color?: string
	children?: React.ReactNode
}

export function IconBtn({ Icon, isActive, color, children }: IconBtnProps) {
	return (
		<button
			className={`btn icon-btn ${isActive ? 'icon-btn-active' : ''} ${
				color || ''
			}`}
		>
			<span className={`${children != null ? 'mr-1' : ''}`}>
				<Icon />
			</span>
			{children}
		</button>
	)
}
