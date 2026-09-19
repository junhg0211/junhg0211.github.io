+++
date = '{{ .Date | time.Format "2006-01-02T15:04:05Z07:00" }}'
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
categories = []
draft = true
list = 'never'
+++
