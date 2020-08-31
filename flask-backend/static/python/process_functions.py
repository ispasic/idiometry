import json
import requests
import re
from nltk import pos_tag, word_tokenize, tokenize
from nltk.stem import PorterStemmer

HEADERS = {"Content-Type": "application/json"}
ENDPOINT = "https://datainnovation.cardiff.ac.uk/api/elasticsearch"


def search_DB(query, index):
    # send query to database
    searchData = send_query_to_DB_endpoint(query, index)

    # format response
    if searchData.get('hits'):
        # empty list for 0 hits
        if len(searchData['hits']['hits']) == 0:
            results = {
                "search_total": searchData['hits']['total']['value'],
                "results_list": []
            }
            return results
        # format results object
        else:
            resultsList = []
            total_results = searchData['hits']['total']['value']
            for hit in searchData['hits']['hits']:
                _id = hit['_id']
                _score = hit['_score']
                highlightedSentence = ' '.join(hit['highlight']['sentence'])
                sentence_dict = {
                    '_id': _id,
                    '_score': _score,
                    'sentence': highlightedSentence
                }
                resultsList.append(sentence_dict)
            results = {
                "search_total": total_results,
                "results_list": resultsList
            }
            return results
    # invalid response
    else:
        raise Exception


def send_query_to_DB_endpoint(query, index):
    url = ENDPOINT + '/' + index + '/_search'
    result = json.loads(requests.get(url, headers=HEADERS, data=json.dumps(query)).text)
    return result


def split_infinitive(search_idiom):
    # remove "to" at the beginning if the first word is the infinitive form of a verb
    tagged_idiom = pos_tag(word_tokenize(search_idiom))
    if (tagged_idiom[0][1] == 'TO') and (tagged_idiom[1][1] == 'VB'):
        result = search_idiom[3:]
    else:
        result = search_idiom

    return result


def pos_tag_idiom(search_idiom):
    # a pronoun is added to the start of the idiom so that some verbs are not mistaken for nouns
    # https://stackoverflow.com/questions/32224227/nltk-identifies-verb-as-noun-in-imperatives
    tagged_idiom = pos_tag(word_tokenize('He ' + search_idiom))
    # return without the added pronoun
    return tagged_idiom[1:]


def calculate_slop(tagged_idiom):
    #  if length > 2, slop = total nouns + total verbs + 1
    if len(tagged_idiom) == 2:
        slop = 1
    else:
        slop = 0
        for j, k in enumerate(tagged_idiom):
            if k[1] in ['NN', 'NNS', 'NNP'] and j != 0:
                slop += 1
            elif k[1] in ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']:
                slop += 1
        slop += 1
    return slop


def remove_pronouns(tagged_idiom):
    # removing pronouns allows open slots for noun phrases to be inserted
    pronoun_words = ['nobody', 'somebody', 'someone', 'something', 'anything', 'nothing', 'anybody', 'anyone', 'one']
    removed_pronouns_array = []
    for i in (tagged_idiom):
        if (i[1] in ['PRP$', 'PRP']) or (i[0] in pronoun_words):
            removed_pronouns_array.append("*")
        elif i[1] == "POS":
            removed_pronouns_array.append('')
        else:
            removed_pronouns_array.append(i[0])
    idiom_without_pronouns = tokenize.treebank.TreebankWordDetokenizer().detokenize(removed_pronouns_array)

    return idiom_without_pronouns


def passivisation_idiom(tagged_idiom):
    # passivisation looks for a leading non-auxilary verb and positions it at the end of the idiom
    # with a space inserted in front
    passivied_array = []
    leading_non_aux = []
    aux_verbs = ['be', 'can', 'could', 'do', 'dare', 'have', 'may', 'might', 'must', 'need', 'ought', 'shall',
                 'should', 'will', 'would']

    for j, k in enumerate(tagged_idiom):
        if j == 0 and k[1] in ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']:
            if k[1] not in aux_verbs:
                leading_non_aux.append("*")
                leading_non_aux.append(k[0])
        else:
            passivied_array.append(k[0])

    passivied_array = passivied_array + leading_non_aux
    passivied_idiom = tokenize.treebank.TreebankWordDetokenizer().detokenize(
        passivied_array)
    return passivied_idiom


def get_query_format(search_idiom, idiom_without_pronouns, passivised_idiom, size, slop, from_position=0):
    # base query
    query = {
        "query": {
            "bool": {
                "should": [{
                    "match_phrase": {
                        "sentence": {
                            "query": search_idiom,
                            "slop": slop
                        }
                    }
                }
                ]
            }
        },
        "highlight": {
            "fields": {
                "sentence": {
                    "number_of_fragments": 1,
                    "fragment_size": 1000,
                    "pre_tags": "<idiom>",
                    "post_tags": "</idiom>"
                }
            }
        },
        "size": size,
        "from": from_position
    }
    # other clauses are added to the base query if applicable
    if idiom_without_pronouns != search_idiom:
        query['query']['bool']['should'].append({
            "match_phrase": {
                "sentence": {
                    "query": idiom_without_pronouns,
                    "slop": slop + 1
                }
            }
        })
    if passivised_idiom != search_idiom:
        query['query']['bool']['should'].append({
            "match_phrase": {
                "sentence": {
                    "query": passivised_idiom,
                    "slop": slop + 1
                }
            }
        })
        # create passivised idiom without pronouns clause if necessary
        if idiom_without_pronouns != search_idiom:
            tagged_passivised_idiom = pos_tag_idiom(passivised_idiom)
            passivised_idiom_without_pronouns = remove_pronouns(tagged_passivised_idiom)
            query['query']['bool']['should'].append({
                "match_phrase": {
                    "sentence": {
                        "query": passivised_idiom_without_pronouns,
                        "slop": slop + 2
                    }
                }
            })
    return query


def create_regex_arguments(tagged_idiom):
    # the first and last word of the idiom are used to create a pattern for improved highlighting
    # stemming each word is the default approach to allow for modification of words
    # pronouns are handled by using any character matches ('.')
    ps = PorterStemmer()
    first_word = tagged_idiom[0][0]
    last_word = tagged_idiom[-1][0]
    first_tag = tagged_idiom[0][1]
    last_tag = tagged_idiom[-1][1]
    pronoun_tags = ['PRP$', 'NNP', 'NNS']
    pronoun_words = [
        "someone", "your", "one", "somebody", "that", "his", "her", "my", "me", "she", "he", "its", "you", "I", "our",
        "their", "mine", "us", "them", "we", "they", "anybody", "anyone", "anything", "each", "either", "everybody",
        "everyone", "everything", "neither", "nobody", "nothing", "something", "both", "few", "many", "serveral", "all",
        "any", "most", "none", "some", "myself", "yourself", "himself", "herself", "itself"]

    # else statement necessary in the case the first or last word is a noun phrase
    if first_word in pronoun_words:
        firstWordRegex = '.'
    elif first_tag is not pronoun_tags:
        firstWordRegex = ps.stem(first_word)
    else:
        firstWordRegex = first_word

    if last_word in pronoun_words:
        lastWordRegex = '.'
    elif last_tag is not pronoun_tags:
        lastWordRegex = ps.stem(last_word)
    else:
        lastWordRegex = first_word

    return [firstWordRegex, lastWordRegex]


def process_sentence_highlights(search_idiom, tagged_idiom, results):
    regex_arguments = create_regex_arguments(tagged_idiom)
    highlighted_results = []
    quantifier_value = len(search_idiom.split()) - 1

    main_regex_pattern = "(?i)^(.*)(<idiom>%s.*(.*/idiom>){%s,}.*%s.*?</idiom>)(.*)$" \
                         % (regex_arguments[0], quantifier_value, regex_arguments[1])

    secondary_regex_pattern = "(?i)^(.*)(<idiom>{}(.*){}.*?</idiom>)(.*)$".format(regex_arguments[0],
                                                                                  regex_arguments[1])

    for result in results['results_list']:
        regex_search_result = re.search(main_regex_pattern, result['sentence'])
        if regex_search_result is not None:
            highlighted_result = process_highlight(regex_search_result)
            highlighted_results.append(highlighted_result)
        else:
            regex_search_result = re.search(secondary_regex_pattern, result['sentence'])
            if regex_search_result is not None:
                highlighted_result = process_highlight(regex_search_result)
                highlighted_results.append(highlighted_result)
            else:
                subject = re.search("(?i)(<idiom>){1}(.*)(</idiom>){1}", result['sentence'])
                middle_section_replace = subject.group(2).replace('<idiom>', '').replace('</idiom>', '')
                result['sentence'] = result['sentence'].replace(subject.group(2), middle_section_replace)
                highlighted_results.append(result['sentence'])
    return highlighted_results


def process_highlight(regex_search_result):
    first_section_replace = regex_search_result.group(1).replace('<idiom>', '').replace('</idiom>', '')
    middle_section_with_tags = re.search("(?i)^(<idiom>){1}(.*)(</idiom>){1}$", regex_search_result.group(2))
    middle_section_replace = middle_section_with_tags.group(2).replace('<idiom>', '').replace('</idiom>', '')
    last_section_replace = regex_search_result.group(4).replace('<idiom>', '').replace('</idiom>', '')
    highlighted_result = (
            first_section_replace + "<idiom>" + middle_section_replace + "</idiom>" + last_section_replace)
    return highlighted_result


def get_source_desc_query(parent_file):
    query = {
        "query": {
            "match": {
                "_id": parent_file
            }
        }
    }
    return query


def search_DB_source_description(query, index):
    searchData = send_query_to_DB_endpoint(query, index)

    # format response
    if searchData.get('hits'):
        if len(searchData['hits']['hits']) != 1:
            raise Exception
        else:
            results = {
                "_id": searchData['hits']['hits'][0]['_id'],
                "sourceStatement": searchData['hits']['hits'][0]['_source']['sourceStatement'],
                "sourceDescription": searchData['hits']['hits'][0]['_source']['sourceDescription']
            }
            return results
    # invalid response
    else:
        raise Exception


def get_explanation_query(search_idiom, idiom_without_pronouns, passivised_idiom, slop, file_id):
    # base query
    query = {
        "query": {
            "bool": {
                "should": [{
                    "match_phrase": {
                        "sentence": {
                            "query": search_idiom,
                            "slop": slop
                        }
                    }
                }
                ],
                "must": [{
                    "match": {
                        "_id": file_id
                    }
                }]
            }
        },
        "highlight": {
            "fields": {
                "sentence": {
                    "number_of_fragments": 1,
                    "fragment_size": 1000,
                    "pre_tags": "<idiom>",
                    "post_tags": "</idiom>"
                }
            }
        },
        "explain": True
    }
    # other clauses are added to the base query if applicable
    if idiom_without_pronouns != search_idiom:
        query['query']['bool']['should'].append({
            "match_phrase": {
                "sentence": {
                    "query": idiom_without_pronouns,
                    "slop": slop + 1
                }
            }
        })
    if passivised_idiom != search_idiom:
        query['query']['bool']['should'].append({
            "match_phrase": {
                "sentence": {
                    "query": passivised_idiom,
                    "slop": slop + 1
                }
            }
        })
        # create passivised idiom without pronouns clause if necessary
        if idiom_without_pronouns != search_idiom:
            tagged_passivised_idiom = pos_tag_idiom(passivised_idiom)
            passivised_idiom_without_pronouns = remove_pronouns(tagged_passivised_idiom)
            query['query']['bool']['should'].append({
                "match_phrase": {
                    "sentence": {
                        "query": passivised_idiom_without_pronouns,
                        "slop": slop + 2
                    }
                }
            })
    return query


def search_DB_explanation(query, index):
    searchData = send_query_to_DB_endpoint(query, index)
    # The formatted results remove the first detail entry and score as that is 1 for matching the _id
    if searchData.get('hits'):
        if len(searchData['hits']['hits']) != 1:
            raise Exception
        else:

            sum_of = []
            for i in searchData['hits']['hits'][0]['_explanation']['details'][1:]:
                detail = {
                    "value": i['value'],
                    "description": i['description']
                }
                sum_of.append(detail)

            results = {
                "sentence": searchData['hits']['hits'][0]['_source']['sentence'],
                "highlight": searchData['hits']['hits'][0]['highlight']['sentence'][0],
                "score": {
                    "value": searchData['hits']['hits'][0]['_score'] - 1,
                    "sum_of": sum_of
                }
            }
            return results
    # invalid response
    else:
        raise Exception
