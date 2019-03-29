const seed = require('seed-random')
// VALKKAA[NIINKU[VITTU]][kentät | funktiot[(kenttä)]]
// TOST[tauluviite[NIINKU alias]]
// [TIETSÄ MISS[hakukriteerit]]
// [JA NIINKO JÄRJESTYKSES kenttäviite[YLÃ–S | ALAS]]
// [MUT VAA[hakutulos - offset,]hakutulosraja]

const functions = {
    SAATANAST: () => Number.MAX_SAFE_INTEGER,
    SIMOSTI: naapurinSimo => {
        const biggestNumberKnownToSimo = seed(naapurinSimo.address)()
        return Math.ceil(biggestNumberKnownToSimo * 200)
    },
    FIKSAA: string => {
        let fixed = string.replace(/ks/g, 'x')
        fixed = fixed.replace(/ts/g, 'z')
        
        return fixed
    },
    TYHJII: field => field == null ? 1 : field
}

const queryTypes = {
    select: 'SELECT',
    insert: 'INSERT',
    delete: 'DELETE',
    alter: 'ALTER'
}

const createIntermediary = ({
    queryType,
    
}) => {
    
}

const getQueryType = query => {
    if(query.startsWith('VALKKAA')) return 'SELECT'
    if(query.startsWith('PAA')) return 'INSERT'
    if(query.startsWith('VIE')) return 'DELETE'
    if(query.startsWith('KORJAA')) return 'ALTER'
}

const parseSelect = query => {
    // const splitQuery = query.match(/(VALKKAA (NIINKU (VITTU)?)?) (.+)\s*TOST (.+)/i)
    const [,select,,,selectParams] = query.match(/(VALKKAA (NIINKU)? (VITTU)? (.+)\s*)TOST/)
    query = query.replace(select).trim()
    const [, from, fromParams] = query.match(/(TOST (.+))\s+/)
    query = query.replace(from).trim()
    if (query.length === 0) return 'lol'

    const optionals = {}
    let optionalPart = query.match(/(TIETSÄ MISS (.+))\s+/)
    if(optionalPart != null) {
        // Note: might have multiple conditions
        optionals.where = {
            full: optionalPart[1],
            params: optionalPart[2]
        }
        query = query.replace(optionals.where)
    }

    optionalPart = query.match(/(MUT VAA (.+))\s+/)
    if (optionalPart != null) {
        // Note: might have multiple conditions
        optionals.limit = {
            full: optionalPart[1],
            params: optionalPart[2]
        }
        query = query.replace(optionals.limit)
    }

    optionalPart = query.match(/(JA NIINK(O|U) JÄRJESTYKSES .+)\s+/)
    
    return {
        select: {
            isDistinct: select.includes('NIINKU'),
            parameters: selectParams
        },
        from: {
            tables: fromParams.split(/,(\s+)?/)
        },
        where: {
            ...optionals.where
        },
        limit: {
            ...optionals.limit
        }
    }
}

const parseInsert = query => {
    throw new Error('Not implemented, plz implement')
}

const parseDelete = query => {
    throw new Error('Not implemented, plz implement')
}

const parseAlter = query => {
    throw new Error('Not implemented, plz implement')
}

console.log(parseSelect(`
VALKKAA NIINKU VITTU etunimi
TOST velkalistast
TIETSÄ MISS sukunimi ON VÄHÄ NIINKU Â´joki%Â´
  JA TIETSÄ velka ON NIINKU AINASKI SAATANASTI()
MUT VAA 10
JA NIINKU JÄRJESTYKSES velka YLÃ–S
`))