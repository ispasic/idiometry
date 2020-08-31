This corpus was used to evaluate idiometry (https://github.com/ispasic/idiometry). It consists of 100 csv files, each corresponding to an idiom, named using the following convention: annotation_<idiom>.csv (e.g. annotation_blow up in your face.csv). Note that each apostrophe was replaced by an underscore in the files' names.

Each csv file has three columns (document, sentence and label), e.g.

document	sentence	label
FAP 2247	Not only could be, but would be, and the whole thing would blow up in my face.	I
K5M 11595	Tim had gone to Warrington's busy town centre to buy a pair of Everton football shorts when an IRA bomb blew up in his face.	L
KNY 1452	Blow up in his face.	U
BMS 1300	Then, in the tiniest second like the one he'd blown up in, he turned his flaming face away again.	O

The sentences were taken from the British National Corpus (BNC). The document column identifies the given sentence within the BNC. The first part (the "letters") represents the ID of the document and the second part represent the sentence number within that document. Please refer to the Reference Guide for the British National Corpus for more information about its organisation: http://www.natcorp.ox.ac.uk/docs/URG.xml?ID=cdifbase#:~:text=An%20XML%20document%2C%20such%20as,occurrences%20are%20delimited%20by%20tags.

The sentences were labelled with respect to the given idiom using the following codes:

I (idiomatic)	: the given expression was used in its idiomatic sense
L (literal)	: the given expression was used in its literal sense
U (unclear)	: the given expression was used in either idiomatic or literal sense, but it is unclear which one without additional context
O (other)	: the sentence does not contain the given (idiomatic) expression

See above for examples of each code for the idiom "blow up in your face".