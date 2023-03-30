import React, { useState, useRef, useEffect } from 'react'
import './App.css'

const isMobileDevice = () => {
	const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
	return mobileRegex.test(navigator.userAgent)
}
//CREAR UN ARRAY CON LAS IMAGENES DE LA CARPETA PUBLIC/TEMPLATES

export default function App() {
	const [imageSrc, setImageSrc] = useState(null)
	const [showSaveButton, setShowSaveButton] = useState(false)
	const [img, setImg] = useState([])
	const slider = useRef()
	const images = [...Array(25).keys()]
	const topTextInput = useRef(null)
	const bottomTextInput = useRef(null)
	const memeCanvas = useRef(null)

	useEffect(() => {
		const loadImg = async () => {
			const imageModules = import.meta.glob('./templates/*.{png,jpg,jpeg,svg}')
			const imgArray = []
			for (const path in imageModules) {
				const module = await imageModules[path]()
				imgArray.push(module.default)
			}
			setImg(imgArray)
		}

		loadImg()
	}, [])

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
			ctx.lineWidth = `${isMobileDevice ? '1' : '2'}` // Ajusta el grosor del trazo en función del tamaño de la fuente

			const paddingTop = fontSize + 10
			// Dibuja el texto superior
			{
				isMobileDevice() ? (
					<>
						{ctx.fillText(topText, canvas.width / 2, paddingTop)}
						{ctx.strokeText(topText, canvas.width / 2, paddingTop)}
					</>
				) : (
					<>
						{ctx.fillText(topText, canvas.width / 2, 50)}
						{ctx.strokeText(topText, canvas.width / 2, 50)}
					</>
				)
			}

			// Dibuja el texto inferior
			ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20)
			ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20)
		}
		setShowSaveButton(true)
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
		setShowSaveButton(false)
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

	const handleClickImg = (meme) => {
		setImageSrc(meme)
		setShowSaveButton(false)
		generateMeme()
	}

	return (
		<div className={`register mx-auto max-w-screen-2xl`}>
			<h1 className='text-3xl font-bold text-center text-white'>Generador de Memes</h1>
			<div className='flex flex-col md:flex-row md:m-14 max-h-fit'>
				<div className='p-2 md:p-8 h-full md:h-[480px] w-full md:w-[40%] self-center'>
					<input
						type='text'
						ref={topTextInput}
						id='top-text'
						className='flex-1 appearance-none border border-gray-300 w-full my-1 md:my-5 py-1 px-4 bg-[#333333] text-white uppercase placeholder-gray-300 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent rounded-xl'
						placeholder='Texto superior'
						autoComplete='on'
					/>
					<input
						type='text'
						ref={bottomTextInput}
						id='bottom-text'
						className='flex-1 appearance-none border border-gray-300 w-full my-1 md:my-5 py-1 px-4 bg-[#333333] text-white uppercase placeholder-gray-300 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent rounded-xl'
						placeholder='Texto inferior'
						autoComplete='on'
					/>
					{/* CARRUSEL */}
					<div className='p-1 mb-8'>
						<label htmlFor='image' className='text-gray-300 p-5 text-center'>
							Seleccionar imagen de la galería
						</label>
						<div className='flex items-center justify-center w-full h-full '>
							<button className='bg-gray-500 mx-2' onClick={() => (slider.current.scrollLeft -= 200)}>
								<svg
									className='w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800'
									fillRule='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7'></path>
								</svg>
							</button>
							<div ref={slider} className='snap-x overflow-x-scroll scroll-smooth h-full flex items-center justify-start'>
								{img.map((meme, index) => (
									<div key={index} className='snap-start flex flex-shrink-0 w-1/2 h-1/2 md:w-1/3 md:h-1/3 mx-2 md:mx-4'>
										<img
											src={meme}
											alt={`template-${index}`}
											className='object-cover object-center  xl:filter xl:grayscale hover:filter-none cursor-pointer hover:border hover:border-purple-500'
											onClick={() => handleClickImg(meme)}
										/>
									</div>
								))}
							</div>
							<button className='bg-gray-500 mx-2' onClick={() => (slider.current.scrollLeft += 200)}>
								<svg
									className='w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800'
									fillRule='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7'></path>
								</svg>
							</button>
						</div>
					</div>
					{/* FIN CARRUSEL */}

					<div className='my-1 md:my-5'>
						<label htmlFor='image' className='text-gray-300 p-5 text-center'>
							Seleccionar desde el dispositivo
						</label>
						<input
							type='file'
							id='image'
							onChange={handleImageChange}
							className='py-2 px-4 flex justify-center items-center  bg-[#333333] hover:bg-purple-600 focus:ring-purple-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
						/>
					</div>

					<button
						onClick={generateMeme}
						className='py-2 md:px-4 flex justify-center items-center  bg-purple-500 hover:bg-purple-600 focus:ring-purple-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
					>
						Generar Meme
					</button>
				</div>
				<div className=' md:h-[480px] w-full md:w-[60%]'>
					<div id='meme' className='p-2 md:p-4  h-full'>
						<canvas ref={memeCanvas} className='w-full h-auto'></canvas>
					</div>
					{showSaveButton && ( // Agregar el botón "Guardar Meme" aquí
						<button
							onClick={saveMeme}
							className='py-2 px-4 flex justify-center items-center  bg-purple-500 hover:bg-purple-600 focus:ring-purple-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
						>
							Guardar Meme
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
