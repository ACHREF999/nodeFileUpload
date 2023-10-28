the index2.js is a simple attempt to try and parse raw data and writing it to a file using only `http` and `fs` builtin modules;

however it turns out there is a delimiter(------WebKitFormBoundary...) between each chunk of data that makes it harder to parse thus using a third party lib like formidable sounds suitable ;