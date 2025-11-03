"use client"

import React from 'react'

export default function GlobalError({ error }: { error: Error }) {
	// Minimal client-side error boundary for Next.js app directory
	console.error('Global error captured:', error)
	return (
		<html>
			<body>
				<div style={{padding:40,display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
					<div>
						<h1 style={{fontSize:24,fontWeight:700}}>Application error</h1>
						<p style={{color:'#666'}}>Произошла ошибка на клиенте. Попробуйте перезагрузить страницу.</p>
					</div>
				</div>
			</body>
		</html>
	)
}
