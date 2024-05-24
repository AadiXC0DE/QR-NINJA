package main

import (
	"qrninja/config"
	"qrninja/routers"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	config.ConnectDatabase()
	r = routers.SetupRouter()
	r.Run(":8080")
}
