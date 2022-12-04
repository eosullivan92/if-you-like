import { IconType } from 'react-icons/lib'

type IconBtnProps = {
	Icon: IconType
	isActive?: boolean
	color?: string
	onClick?: () => void
	children?: React.ReactNode
}

export function IconBtn({
	Icon,
	isActive,
	color,
	onClick,
	children,
}: IconBtnProps) {
	return (
		<button
			className={`btn icon-btn ${isActive ? 'icon-btn-active' : ''} ${
				color || ''
			}`}
			onClick={onClick}
		>
			<span className={`${children != null ? 'mr-1' : ''}`}>
				<Icon />
			</span>
			{children}
		</button>
	)
}
