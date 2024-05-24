package routers

import (
	"qrninja/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.POST("/qr/:userId", controllers.StoreQRCode)
	r.GET("/qr/:userId", controllers.FetchQRCodes)
	r.DELETE("/qr/:userId/:id", controllers.DeleteQRCode)

	return r
}
