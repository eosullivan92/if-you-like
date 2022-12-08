import { useState } from 'react'

type HeaderProps = {
	handleCreatePostActive: () => void
}

export const Header = ({ handleCreatePostActive }: HeaderProps) => {
	return (
		<header className="navbar">
			<h1>If You Like</h1>

			<button className="btn" onClick={() => handleCreatePostActive()}>
				+ Create Post
			</button>
		</header>
	)
}
