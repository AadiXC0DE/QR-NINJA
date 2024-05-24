package controllers

import (
	"net/http"
	"qrninja/config"
	"qrninja/models"

	"github.com/gin-gonic/gin"
)

func StoreQRCode(c *gin.Context) {
	var qr models.QRCode
	if err := c.ShouldBindJSON(&qr); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	uuid := c.Param("userId")
	qr.UserId = uuid

	config.DB.Create(&qr)
	c.JSON(http.StatusOK, qr)
}

func FetchQRCodes(c *gin.Context) {
	userId := c.Param("userId")
	var qrs []models.QRCode
	config.DB.Where("user_id = ?", userId).Find(&qrs)
	c.JSON(http.StatusOK, qrs)
}

func DeleteQRCode(c *gin.Context) {
	userId := c.Param("userId")
	id := c.Param("id")
	var qr models.QRCode
	if err := config.DB.Where("user_id = ? AND id = ?", userId, id).First(&qr).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}
	config.DB.Delete(&qr)
	c.JSON(http.StatusOK, gin.H{"message": "record deleted"})
}
