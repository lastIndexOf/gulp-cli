
class DrawCanvas {
	constructor(ctx) {
		const canvas = ctx.canvas

		this.ctx = ctx
		this.ctx.canvas.width = canvas.offsetWidth
		this.ctx.canvas.height = canvas.offsetHeight
	}
	drawLine ({
		x = 0,
		y = 0,
		xl = 0,
		yl = 0
	}) {
		this.ctx.save()
		this.ctx.beginPath()
		this.ctx.moveTo(x, y)
		this.ctx.lineTo(xl, yl)
		this.ctx.transform(1, 0, 0, 1, 500, 400)
		this.ctx.closePath()
		this.ctx.restore()

		this.ctx.lineWidth = 10

		this.ctx.stroke()
	}
	drawStar ({
		x = 0,
		y = 0,
		R = 100,
		r = 75,
		rot = 0,
		color = '#ddd',
		isFill = false,
		fillColor = '#ddd'
	}) {
		const self = this

		this.ctx.beginPath()
		for (let i = 0; i < 5; i++) {
			self.ctx.lineTo(Math.cos((18 + i * 72 - rot) / 180 * Math.PI) * R + x
											, -Math.sin((18 + i * 72 - rot) / 180 * Math.PI) * R + y)
			self.ctx.lineTo(Math.cos((54 + i * 72 - rot) / 180 * Math.PI) * r + x
											, -Math.sin((54 + i * 72 - rot) / 180 * Math.PI) * r + y)
		}
		this.ctx.closePath()

		this.ctx.strokeStyle = color
		if (isFill) {
			self.ctx.fillStyle = fillColor
			self.ctx.fill()
		}

		this.ctx.stroke()
	}
	
}

module.exports = DrawCanvas