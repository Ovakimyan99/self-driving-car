class Sensor {
    constructor(car) {
        this.car = car
        this.rayCount = 5
        this.rayLength = 150
        this.raySpread = Math.PI / 2

        this.rays = []
        this.readings = []
    }

    update(roadBorders) {
        this.#custRace()

        this.readings = []
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            )
        }
    }

    #getReading(ray, roadBorders) {
        let touches = []

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            )

            if(touch) {
                touches.push(touch)
            }

            if (!touches.length) {
                return null
            } else {
                const offsets = touches.map(e => e.offset)
                const minOffset = Math.min(...offsets)
                return touches.find(e => e.offset === minOffset)
            }
        }
    }

    #custRace() {
        this.rays = []
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                i / (this.rayCount > 1 ? (this.rayCount - 1) : 0.5)
            ) + this.car.angle

            const start = {x: this.car.x, y: this.car.y}
            const end = {
                x: this.car.x -
                    Math.sin(rayAngle) * this.rayLength,
                y: this.car.y -
                    Math.cos(rayAngle) * this.rayLength
                }

            this.rays.push([start, end])
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            const ray = this.rays[i]

            let end = ray[1]
            if (this.readings[i]) {
                end = this.readings[i]
            }
            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = 'yellow'
            ctx.moveTo(ray[0].x, ray[0].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()

            ctx.beginPath()
            ctx.lineWidth = 3
            ctx.strokeStyle = 'black'
            ctx.moveTo(ray[1].x, ray[1].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
        }
    }
}