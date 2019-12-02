# ;encoding=utf-8
# Example file to redact Social Security Numbers from the
# text layer of a PDF and to demonstrate metadata filtering.

import re
import sys
from datetime import datetime

from pdfrw import PdfReader, PdfWriter

import pdf_redactor



# print("dataToSendBack"+str(sys.argv[1]))
# sys.stdout.flush()

def redactor(options):
    # This is the function that performs redaction.
    print("taking the input ")
    if options.input_stream is None:
        options.input_stream = "/home/achaq/Leyton/Untitled_Message/36.pdf"  # input stream containing the PDF to redact
    if options.output_stream is None:
        options.output_stream = "/home/achaq/Leyton/Untitled_Message/36_redacted.pdf"  # output stream to write the new, redacted PDF to

    document = PdfReader(options.input_stream)
    if options.content_filters:
        # Build up the complete text stream of the PDF content.
        text_layer = pdf_redactor.build_text_layer(document, options)

        # Apply filters to the text stream.
        pdf_redactor.update_text_layer(options, *text_layer)

        # Replace page content streams with updated tokens.
        pdf_redactor.apply_updated_text(document, *text_layer)

    # Update annotations.
    pdf_redactor.update_annotations(document, options)
#     print("after updating the annotation ")
    # Write the PDF back out.
    writer = PdfWriter()
    writer.trailer = document
    writer.write(options.output_stream)
#     print("back out ")


#
#
wordsToSearch = ['coût:00147225V']
fruit_list = ['F301', 'GRUPO', '00001', 'coût:00147225V', 'L\'ORGE', 'EQUIPE', 'DV2']

options = pdf_redactor.RedactorOptions()
options.content_filters = [(
    re.compile(u"[−–—~‐]"),
    lambda m: "-"
),
    (re.compile('|'.join(fruit_list)),
     lambda m: "           "),
]


redactor(options)
print(str(sys.argv[3]))
sys.stdout.flush()
