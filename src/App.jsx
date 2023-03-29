import React, { useState, useRef } from 'react'
import './App.css'
export default function App() {
	const [imageSrc, setImageSrc] = useState(null)
	const topTextInput = useRef(null)
	const bottomTextInput = useRef(null)
	const imageInput = useRef(null)
	const memeCanvas = useRef(null)

	const generateMeme = () => {
		const canvas = memeCanvas.current
		const ctx = canvas.getContext('2d')
		const image = new Image()
		image.src = imageSrc
		image.onload = () => {
			canvas.width = image.width
			canvas.height = image.height
			ctx.drawImage(image, 0, 0)
			const topText = topTextInput.current.value.toUpperCase()
			const bottomText = bottomTextInput.current.value.toUpperCase()
			const fontSize = canvas.width * 0.08 // Ajusta el tamaño de la fuente en función del ancho del canvas
			ctx.font = `${fontSize}px Impact`
			ctx.fillStyle = 'white'
			ctx.textAlign = 'center'
			ctx.strokeStyle = 'black'
			ctx.lineWidth = fontSize * 0.1 // Ajusta el grosor del trazo en función del tamaño de la fuente

			// Dibuja el texto superior
			ctx.fillText(topText, canvas.width / 2, 50)
			ctx.strokeText(topText, canvas.width / 2, 50)

			// Dibuja el texto inferior
			ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20)
			ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20)
		}
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		const reader = new FileReader()
		reader.onloadend = () => {
			setImageSrc(reader.result)
		}
		if (file) {
			reader.readAsDataURL(file)
		}
	}

	const saveMeme = () => {
		const canvas = memeCanvas.current
		const link = document.createElement('a')
		link.href = canvas.toDataURL('image/png')
		link.download = 'meme.png'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	return (
		<>
			<h1 className='text-3xl font-bold text-center text-purple-950 my-5'>Generador de Memes</h1>
			<div className='flex flex-col md:flex-row m-10'>
				<div className='p-4 h-full md:h-[480px] w-full md:w-[30%]'>
					<input
						type='text'
						ref={topTextInput}
						id='top-text'
						className=' flex-1 appearance-none border border-gray-300 w-full my-1 md:my-5 py-2 px-4 bg-white text-purple-700 uppercase placeholder-purple-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
						placeholder='Texto superior'
					/>
					<input
						type='text'
						ref={bottomTextInput}
						id='bottom-text'
						className=' flex-1 appearance-none border border-gray-300 w-full my-1 md:my-5 py-2 px-4 bg-white text-purple-700 uppercase placeholder-purple-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
						placeholder='Texto inferior'
					/>

					<div className='my-1 md:my-5'>
						<label htmlFor='image' className='text-purple-600 p-5 '>
							Imagen
						</label>
						<input
							type='file'
							id='image'
							onChange={handleImageChange}
							className='py-2 px-4 flex justify-center items-center  bg-purple-200 hover:bg-purple-600 focus:ring-purple-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
						/>
					</div>

					<button
						onClick={generateMeme}
						className='py-2 px-4 flex justify-center items-center  bg-purple-500 hover:bg-purple-600 focus:ring-purple-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
					>
						Generar Meme
					</button>
				</div>
				<div className=' md:h-[480px] w-full md:w-[70%]'>
					<div id='meme' className='p-4 bg-purple-200 h-auto'>
						<canvas ref={memeCanvas} className='w-full h-auto'></canvas>
					</div>
					<button
						onClick={saveMeme}
						className='py-2 px-4 flex justify-center items-center  bg-purple-500 hover:bg-purple-600 focus:ring-purple-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
					>
						Guardar Meme
					</button>
				</div>
			</div>
		</>
	)
}
