package notificationController
import (
	"fmt"
	"net/http"
	"time"
)

func SendNotifications(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")
    w.Header().Set("Access-Control-Allow-Origin", "*")

    notifications := []string{"Hello", "Hello Again"}
    for _, notification := range notifications {
        fmt.Fprintf(w, "data: %s\n\n", notification)
		fmt.Println("Notification Sent : ",notifications)
        w.(http.Flusher).Flush()
        time.Sleep(5 * time.Second)
    }
	fmt.Println("Connection Closed")
    notify := w.(http.CloseNotifier).CloseNotify()
    <-notify
}