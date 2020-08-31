from flask import Flask, render_template, request, jsonify
from static.python.process_functions import *

app = Flask(__name__)


# page routes defined using react-router-dom
@app.route('/')
def render_app():
    return render_template("index.html")


@app.route('/about')
def render_about_page():
    return render_template("index.html")


@app.route('/results.txt/<string:query>')
def render_results_txt_page(query):
    return render_template("index.html")


@app.route('/api/search_sentences/', methods=['GET'])
def pre_post_process_search():
    # process input params
    search_idiom = request.args.get('q').lower() or Exception
    size = request.args.get('s') or Exception
    from_position = request.args.get('f') or 0

    # remove "to" at the beginning if the first word is infinitive form of a verb
    search_idiom = split_infinitive(search_idiom)

    # pre-process (slop and tags)
    tagged_idiom = pos_tag_idiom(search_idiom)
    slop = calculate_slop(tagged_idiom)
    idiom_without_pronouns = remove_pronouns(tagged_idiom)
    passivised_idiom = passivisation_idiom(tagged_idiom)

    # format query
    search_query = get_query_format(search_idiom, idiom_without_pronouns, passivised_idiom, size, slop,
                                    from_position)

    # send query to elasticsearch
    results = search_DB(search_query, 'bnc')

    # post-process response
    processed_sentences = process_sentence_highlights(search_idiom, tagged_idiom, results)

    # map processed sentences to results list
    for k, i in enumerate(processed_sentences):
        results['results_list'][k]['sentence'] = i

    # return response
    return jsonify(results)


@app.route('/api/search_source/', methods=['GET'])
def process_source_search():
    fileId = request.args.get('file_id') or Exception
    parent_file = re.search(r"^(\S+)", fileId).group(1)

    query = get_source_desc_query(parent_file)
    results = search_DB_source_description(query, 'bnc')

    return jsonify(results)


@app.route('/api/search_explanation/', methods=['GET'])
def process_explanation_search():
    # using the search API with explain set to true rather than querying the explain API because
    # the results through the search API also show the original highlight which adds to the explanation
    search_idiom = request.args.get('search_idiom').lower() or Exception
    file_id = request.args.get('file_id') or Exception

    tagged_idiom = pos_tag_idiom(search_idiom)
    slop = calculate_slop(tagged_idiom)
    idiom_without_pronouns = remove_pronouns(tagged_idiom)
    passivised_idiom = passivisation_idiom(tagged_idiom)

    query = get_explanation_query(search_idiom, idiom_without_pronouns, passivised_idiom, slop,
                                  file_id)

    results = search_DB_explanation(query, 'bnc')

    return jsonify(results)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
