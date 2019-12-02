import sys
import re
from datetime import datetime

from pdfrw import PdfReader, PdfWriter

import pdf_redactor



def redactor(options):
    # This is the function that performs redaction.
#     print("taking the input ")
    if options.input_stream is None:
        options.input_stream = "/home/achaq/Leyton/Nodejs/anonym1/uploads/doc-"+str(sys.argv[1])+".pdf"  # input stream containing the PDF to redact
    if options.output_stream is None:
        options.output_stream = "/home/achaq/Leyton/Nodejs/anonym1/uploads/doc-"+str(sys.argv[1])+"_anonym.pdf"  # output stream to write the new, redacted PDF to

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




wordsToSearch = ['coût:00147225V']
fruit_list = str(sys.argv[3])
# fruit_list = fruit_list.split('\f')
print(fruit_list)
options = pdf_redactor.RedactorOptions()
options.content_filters = [(
    re.compile(u"[−–—~‐]"),
    lambda m: "-"
),
    (re.compile('|'.join(fruit_list)),
     lambda m: "           "),
]


redactor(options)
print(str(sys.argv[1]))
sys.stdout.flush()
