from .process_functions import *


def load_json(file):
    with open(file, 'r') as myFile:
        data = myFile.read()
    obj = json.loads(data)
    return obj


class TestConnectionToDB:
    query = {
        "query": {
            "match_phrase": {
                "sentence": {
                    "query": "test database"
                }
            }
        },
        "highlight": {
            "fields": {
                "sentence": {
                    "number_of_fragments": 1,
                    "fragment_size": 1000
                }
            }
        },
        "size": 100
    }

    def test_able_get_bnc_sentence_from_DB(self):
        results = send_query_to_DB_endpoint(self.query, "bnc")
        assert results['hits']['total']['value'] == 1

    def test_correctly_formats_valid_response(self):
        results = search_DB(self.query, "bnc")
        assert results.get('search_total') == 1
        assert len(results.get('results_list')) == 1


class TestIdiomProcessing:

    def test_split_infinitive(self):
        idiom = 'to sleep on the job'
        processed = split_infinitive(idiom)
        assert processed == 'sleep on the job'

    def test_correct_pos_tags_returned(self):
        idiom = "bury the hatchet"
        tagged_idiom = pos_tag_idiom(idiom)
        assert tagged_idiom == [('bury', 'VBD'), ('the', 'DT'), ('hatchet', 'NN')]

    def test_correct_calculation_of_slop(self):
        idiom = "call someone's bluff"
        tagged_idiom = pos_tag_idiom(idiom)
        slop = calculate_slop(tagged_idiom)
        assert slop == 4

    def test_pronouns_correctly_removed(self):
        idiom = "in one's own sweet time"
        tagged_idiom = pos_tag_idiom(idiom)
        idiom_without_pronouns = remove_pronouns(tagged_idiom)
        assert idiom_without_pronouns == 'in *  own sweet time'

    def test_idiom_correctly_passivised(self):
        idiom = "bury the hatchet"
        tagged_idiom = pos_tag_idiom(idiom)
        passivised_idiom = passivisation_idiom(tagged_idiom)
        assert passivised_idiom == 'the hatchet * bury'


class TestQueryFormatProcessing:
    search_idiom = "call someone’s bluff"
    idiom_without_pronouns = "call * bluff"
    passivised_idiom = "someone's bluff * call"
    size = 100
    slop = 4

    def test_correct_query_format_is_given_for_input(self):
        query = get_query_format(self.search_idiom, self.idiom_without_pronouns, self.passivised_idiom, self.size,
                                 self.slop)
        expected_query = load_json('static/python/test_expected_query_format.json')
        assert query == expected_query


class TestHighlightProcessing:

    def test_correct_regex_arguments_given(self):
        idiom = "facts speak for themselves"
        tagged_idiom = pos_tag_idiom(idiom)
        regex_arguments = create_regex_arguments(tagged_idiom)
        assert regex_arguments == ['fact', 'themselv']

    def test_correct_highlight_processing(self):
        regex_pattern = "(?i)^(.*)(<idiom>%s.*(.*/idiom>){%s,}.*%s.*?</idiom>)(.*)$" % ('fact', 3, 'themselv')
        result = "Autoseeker speaks to the thief — the <idiom>facts</idiom> <idiom>speak</idiom> <idiom>for</idiom> <idiom>themselves</idiom>. He went on to say..."
        regex_search_result = re.search(regex_pattern, result)
        highlighted_result = process_highlight(regex_search_result)
        assert highlighted_result == 'Autoseeker speaks to the thief — the <idiom>facts speak for themselves</idiom>. He went on to say...'
