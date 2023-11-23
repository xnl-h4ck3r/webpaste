/*
webpaste 2.0 by xnl-h4xk3r

This is an upgraded version of https://github.com/tomnomnom/hacks/tree/master/webpaste by @TomNomNom
*/

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"io/ioutil"
	"sort"
)

type payload struct {
	Token string   `json:"token"`
	Lines []string `json:"lines"`
}

// globals
var bus chan []string
var results []string

// ANSI escape codes for colors
const (
	colorReset  = "\033[0m"
	colorCyan   = "\033[96m"
	colorWhite  = "\033[97m"
	colorRed    = "\033[91m"
	colorMagenta  = "\033[95m"
	colorYellow = "\033[93m"

)

func payloadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "text/plain")

	if r.Method != "POST" {
		fmt.Fprint(w, "not gonna happen sorry")
		return
	}

	token := os.Getenv("WEBPASTE_TOKEN")

	d := json.NewDecoder(r.Body)
	p := &payload{}
	err := d.Decode(p)
	if err != nil {
		fmt.Fprintf(os.Stderr, colorRed+"Failed to decode JSON: %s\n"+colorReset, err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if p.Token != token {
		fmt.Fprintf(os.Stderr, colorRed+"Got invalid token. Check token in extension Options is the same as env variable WEBPASTE_TOKEN\n"+colorReset)
		http.Error(w, "lol no", http.StatusUnauthorized)
		return
	}

	bus <- p.Lines
}

func main() {

	var port string
	flag.StringVar(&port, "p", "8082", "port to listen on")

	var address string
	flag.StringVar(&address, "h", "localhost", "address to listen on")

	var outfile string
	flag.StringVar(&outfile, "o", "webpaste.txt", "output file name")

	var dontSortAndDedupe bool
	flag.BoolVar(&dontSortAndDedupe, "d", false, "don't sort and de-duplicate output")

	flag.Parse()

	fmt.Println(colorCyan + "Listening on http://" + address + ":" + port + " for requests from browser extension..." + colorReset)

	// Setup our Ctrl+C handler
	SetupCloseHandler(outfile, dontSortAndDedupe)

	if os.Getenv("WEBPASTE_TOKEN") == "" {
		fmt.Fprintln(os.Stderr, colorRed+"Environment variable WEBPASTE_TOKEN is not set. Example, use 'export WEBPASTE_TOKEN=ilovetomnomnom' and also set that as the 'token' in the extension Options."+colorReset)
		return
	}

	bus = make(chan []string)

	go func() {
		seen := make(map[string]bool)

		for ss := range bus {
			for _, s := range ss {
				// Skip empty lines and lines that are just newline characters
				if s == "" || strings.TrimSpace(s) == "" {
					continue
				}

				if !dontSortAndDedupe && seen[s] {
					continue
				}
				seen[s] = true
				fmt.Println(s)

				results = append(results, s)
			}
		}
	}()

	http.HandleFunc("/", payloadHandler)
	http.ListenAndServe(address+":"+port, nil)
}

func SetupCloseHandler(outfile string, dontSortAndDedupe bool) {
	c := make(chan os.Signal,1)
    signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		fmt.Println(colorMagenta + "\r- Ctrl+C pressed in Terminal" + colorReset)

		if len(results) > 0 {
			if dontSortAndDedupe {
				// Write to the file
				err := ioutil.WriteFile(outfile, []byte(strings.Join(results, "\n")+"\n"), 0644)
				if err != nil {
					fmt.Println(colorRed + "Error writing to file " + outfile + ": " + err.Error() + colorReset)
					os.Exit(1)
				}
			} else {
				// Sort and de-duplicate the strings if required
				sort.Strings(results)

				// Deduplicate the strings
				seen := make(map[string]bool)
				var deduplicatedStrings []string
				for _, s := range results {
					if !seen[s] {
						seen[s] = true
						deduplicatedStrings = append(deduplicatedStrings, s)
					}
				}

				// Write the sorted a de-duped strings to the file
				err := ioutil.WriteFile(outfile, []byte(strings.Join(deduplicatedStrings, "\n")+"\n"), 0644)
				if err != nil {
					fmt.Println(colorRed + "Error writing to file: " + err.Error() + colorReset)
					os.Exit(1)
				}
			}

			fmt.Println(colorCyan + "Output written to file " + colorWhite + outfile + colorReset)
		} else {
			fmt.Println(colorCyan + "No results written to file " + colorWhite + outfile + colorReset)
		}
		os.Exit(0)
	}()
}
