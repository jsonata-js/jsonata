var utils = require('./utils');

const signature = (() => {
    'use strict';

    /**
     * Parses a function signature definition and returns a validation function
     * @param {string} signature - the signature between the <angle brackets>
     * @returns {Function} validation function
     */
    function parseSignature(signature) {
        // https://swtch.com/~rsc/regexp/regexp1.html
        
        const context_index = -1;   //fake index for context value to use as `source_arg_index` in match.add_matched_arg
        const undefined_index = -2; //fake index for undefined value to use as `source_arg_index` in match.add_matched_arg

        class AutomataState {
            constructor() {}
            push(current_match, match_info) {
                throw "should not happen";
            }
            link(to_state) {
                this.next_state = to_state;
            }
        }

        class EndState extends AutomataState {
            constructor() {
                super();
            }
            push(current_match, match_info) {
                current_match.success = true;
                match_info.check_match(current_match);
            }
        }

        class MatchContextState extends AutomataState {
            constructor(matcher, target_arg_index) {
                super();
                this.matcher = matcher;
                this.target_arg_index = target_arg_index;
            }
            push(current_match, match_info) {
                if (match_info.context === undefined) {
                    // no context to match against -> fail
                    match_info.check_match(current_match);
                } else if (this.matcher.match(match_info.context)) {
                    // success
                    current_match.add_matched_arg(this.target_arg_index, context_index);
                    current_match.uses_context = true;
                    // proceed
                    this.next_state.push(current_match, match_info); 
                } else {
                    // failed to match 
                    match_info.check_match(current_match);
                }
            }
        }

        class EmptyMatchState extends AutomataState {
            constructor(target_arg_index) {
                super();
                this.target_arg_index = target_arg_index;
            }
            push(current_match, match_info) {
                current_match.add_matched_arg(this.target_arg_index, undefined_index);
                // proceed
                this.next_state.push(current_match, match_info); 
            }
        }        

        class MatchArgState extends AutomataState {
            constructor(matcher, target_arg_index) {
                super();
                this.matcher = matcher;
                this.target_arg_index = target_arg_index;
            }
            push(current_match, match_info) {
                if (current_match.source_arg_index >= match_info.args.length) {
                    //no source arg to match -> fail
                    match_info.check_match(current_match);
                    return;
                }
                const value = match_info.args[current_match.source_arg_index]
                if (this.matcher.match(value)) {
                    // success
                    current_match.add_matched_arg(this.target_arg_index, current_match.source_arg_index);
                    current_match.source_arg_index++;
                    // proceed
                    this.next_state.push(current_match, match_info); 
                } else {
                    // failed to match 
                    match_info.check_match(current_match);
                }
            }
        }

        class SplitState extends AutomataState {
            constructor(alternative_state) {
                super();
                this.alternative_state = alternative_state;
            }
            push(current_match, match_info) {
                const alternative_match = current_match.clone();
                this.next_state.push(current_match, match_info);
                this.alternative_state.push(alternative_match, match_info);
            }
        }

        class AutomataFragment {
            constructor(state) {
                this.start_state = state;
                this.end_states = [state];
            }
            link(to_fragment) {
                this.end_states.forEach((end_state) => {
                    end_state.link(to_fragment.start_state);
                })
            }
        }

        function getSymbol(value) {
            let symbol;
            if (utils.isFunction(value)) {
                symbol = 'f';
            } else {
                const type = typeof value;
                switch (type) {
                    case 'string':
                        symbol = 's';
                        break;
                    case 'number':
                        symbol = 'n';
                        break;
                    case 'boolean':
                        symbol = 'b';
                        break;
                    case 'object':
                        if (value === null) {
                            symbol = 'l';
                        } else if (Array.isArray(value)) {
                            symbol = 'a';
                        } else {
                            symbol = 'o';
                        }
                        break;
                    case 'undefined':
                    default:
                        // any value can be undefined, but should be allowed to match
                        symbol = 'm'; // m for missing
                }
            }
            return symbol;
        };

        function createMatcher(char) {
            let chars = '';
            switch (char) {
                case 'b':
                case 'n':
                case 's':
                case 'l':
                case 'o':
                    chars = char;
                    break;
                case 'a':
                case 'f':
                    //TODO: sub signatures!
                    chars = char;
                    break;
                case 'u':
                    chars = 'bnsl';
                    break;
                case 'j':
                    chars = 'bnsloa';
                    break;
                case 'x':
                    chars = 'bnsloaf';
            }
            // any value can be undefined, but should be allowed to match
            chars = `${chars}m`; // m for missing
            return {
                chars: chars,
                match: function(value) {
                    const symbol = getSymbol(value);
                    return chars.includes(symbol);
                    const type = typeof val;
                    switch (type) {
                        case 'number':
                            return true;
                        default:
                            return false;
                    }
                }
            };
        }

        

        let fragments = [];
        let target_arg_index = 0;
        for (let position = 0; position < signature.length; position++) {
            let symbol = signature.charAt(position);
            if (symbol === ':') {
                // TODO figure out what to do with the return type
                // ignore it for now
                break;
            }
            switch (symbol) {
                case '+':
                    {
                        if (fragments.length === 0) {
                            throw "empty '+'";
                        }
                        const last_fragment = fragments.at(-1);
                        const split = new SplitState(last_fragment.start_state);
                        last_fragment.end_states.forEach((end_state) => {
                            end_state.link(split);
                        });
                        last_fragment.end_states = [split];
                    }
                    break;
                case '-':
                    {
                        if (fragments.length === 0) {
                            throw "empty '-'";
                        }
                        const last_fragment = fragments.at(-1);
                        if (last_fragment.end_states.length !== 1 
                            || last_fragment.start_state !== last_fragment.end_states[0]
                            || !(last_fragment.start_state instanceof MatchArgState)
                        ) {
                            throw "applying '-' to non-matcher state";
                        }
                        const old_state = last_fragment.start_state;
                        const split = new SplitState(old_state);
                        const new_state = new MatchContextState(old_state.matcher, old_state.target_arg_index);
                        split.link(new_state);
                        last_fragment.end_states.push(new_state);
                        last_fragment.start_state = split;
                    }
                    break;
                case '?':
                    {
                        if (fragments.length === 0) {
                            throw "empty '?'";
                        }
                        const last_fragment = fragments.at(-1);
                        const split = new SplitState(last_fragment.start_state);
                        const new_state = new EmptyMatchState(target_arg_index - 1);    //for previous arg
                        split.link(new_state);
                        last_fragment.end_states.push(new_state);
                        last_fragment.start_state = split;
                    }
                    break;
                default:
                    {
                        fragments.push(
                            new AutomataFragment(
                                new MatchArgState(createMatcher(symbol), target_arg_index)
                            )
                        );
                        target_arg_index++;
                    }
                    break;
            }
        }
        fragments.push(new AutomataFragment(new EndState()));

        for (let fragment_index = 0; fragment_index < fragments.length - 1; fragment_index++) {
            fragments[fragment_index].link(fragments[fragment_index + 1]);
        }

        var automata_root_state = fragments[0].start_state;

        class Match {
            constructor() {
                this.success = false;
                this.matched_args = [];
                this.source_arg_index = 0;
                this.uses_context = false;
            }
            add_matched_arg(match_arg_index, source_arg_index) {
                if (this.matched_args[match_arg_index] === undefined) {
                    //no value yet -> set it
                    this.matched_args[match_arg_index] = source_arg_index; 
                } else if (Array.isArray(this.matched_args[match_arg_index])) {
                    //already have array of values -> append to it (support for '+')
                    this.matched_args[match_arg_index].push(source_arg_index);
                } else {
                    //just a single value -> convert to array (support for '+')
                    this.matched_args[match_arg_index] = [this.matched_args[match_arg_index], source_arg_index];
                }
            }
            clone() {
                var result = new Match();
                result.success = this.success;
                result.matched_args = structuredClone(this.matched_args);
                result.source_arg_index = this.source_arg_index;
                result.uses_context = this.uses_context;
                return result;
            };
        }

        return {
            definition: signature,
            validate: function (args, context) {
                
                var match_info = {
                    args: args,
                    context: context,
                    best_match: new Match(),
                    check_match: function(match) {
                        if (this.best_match.success && !match.success) {
                            //nothing to do
                        } else if (!this.best_match.success && match.success) {
                            this.best_match = match;
                        } else if (match.source_arg_index > this.best_match.source_arg_index) {
                            this.best_match = match;
                        } else if (match.source_arg_index == this.best_match.source_arg_index
                            && match.uses_context 
                            && !this.best_match.uses_context
                        ) {
                            this.best_match = match;
                        }
                    }
                };

                //actual match happens here
                automata_root_state.push(new Match(), match_info);

                if (match_info.best_match.success) {
                    var result = [];
                    match_info.best_match.matched_args.forEach(arg_index => {
                        if (Array.isArray(arg_index)) {
                            var nested = [];
                            arg_index.forEach(sub_index => {
                                nested.push(match_info.args[sub_index]);    
                            });
                            result.push(nested);
                        } else if (arg_index === context_index) {
                            result.push(match_info.context);
                        } else if (arg_index === undefined_index) {
                            result.push(undefined);                            
                        } else {
                            result.push(match_info.args[arg_index]);
                        }
                    });
                    return result;
                }
                throw {
                    code: "T0410",
                    stack: (new Error()).stack,
                    value: match_info.args[match_info.best_match.source_arg_index],
                    index: match_info.best_match.source_arg_index + 1
                };
            }
        };
    }

    return parseSignature;
})();

module.exports = signature;
