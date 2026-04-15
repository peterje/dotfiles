Debugging with Axiom 

> ## Documentation Index
> Fetch the complete documentation index at: https://axiom.co/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Run query
> Query

<Warning>
  This endpoint allows you to query data stored in any edge deployment, but query results are routed through the US East 1 (AWS) deployment. This means that if you store data in an edge deployment other than US East 1 (AWS), query results leave the edge deployment where your data is stored. For more information, see [Edge deployments](/reference/edge-deployments).

  The base domain for this endpoint is `https://api.axiom.co`, irrespective of your edge deployment.

  To query data without results leaving the edge deployment where your data is stored, use the [Run APL query to edge deployment](/restapi/endpoints/queryEdge) or [Run batch query to edge deployment](/restapi/endpoints/queryBatch) endpoints.
</Warning>


## OpenAPI

````yaml v1 post /datasets/_apl?format=tabular
openapi: 3.0.1
info:
  title: Axiom Public API
  description: A public and stable API for interacting with Axiom services
  termsOfService: http://axiom.co/terms
  contact:
    name: Axiom support team
    url: https://axiom.co
    email: hello@axiom.co
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
  version: 1.0.0
servers:
  - url: https://api.axiom.co/v1/
security:
  - Auth: []
paths:
  /datasets/_apl?format=tabular:
    post:
      tags:
        - Datasets
      description: Query
      operationId: queryApl
      parameters:
        - name: format
          in: query
          required: true
          schema:
            type: string
            enum:
              - legacy
              - tabular
        - name: nocache
          in: query
          schema:
            type: boolean
            default: false
        - name: saveAsKind
          in: query
          schema:
            type: string
        - name: dataset_name
          in: query
          description: >-
            When saveAsKind is true, this parameter indicates the name of the
            associated dataset.
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/APLRequestWithOptions'
        required: true
      responses:
        '200':
          description: Successful APL result
          headers:
            X-QueryLimit-Limit:
              schema:
                type: integer
            X-QueryLimit-Remaining:
              schema:
                type: integer
            X-QueryLimit-Reset:
              schema:
                type: integer
            X-Axiom-History-Query-Id:
              schema:
                type: string
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AplResult'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ForbiddenError'
      security:
        - Auth:
            - CanQuery
components:
  schemas:
    APLRequestWithOptions:
      required:
        - apl
      type: object
      properties:
        apl:
          type: string
          description: >-
            APL query to execute. For more information, see [Introduction to
            APL](/apl/introduction).
        cursor:
          type: string
        endTime:
          type: string
        includeCursor:
          type: boolean
        queryOptions:
          $ref: '#/components/schemas/QueryOptions'
        startTime:
          type: string
          description: >-
            start and end time for the query, these must be specified as RFC3339
            strings

            or using relative time expressions (e.g. now-1h, now-1d, now-1w,
            etc)
        variables:
          type: object
          additionalProperties:
            type: object
            properties: {}
          description: >-
            Variables is an optional set of additional variables that are
            inserted into the APL
      example:
        apl: '["dataset-name"] | limit 10'
        startTime: string
        endTime: string
    AplResult:
      required:
        - datasetNames
        - format
        - status
      type: object
      properties:
        buckets:
          $ref: '#/components/schemas/Timeseries'
        datasetNames:
          type: array
          items:
            type: string
          x-go-name: DatasetNames
        fieldsMetaMap:
          type: object
          additionalProperties:
            type: array
            items:
              $ref: '#/components/schemas/DatasetField'
          description: >-
            FieldsMetaMap contains the unit information (if we have it) for each
            field in the given dataset entry
          x-go-name: FieldsMetaMap
        format:
          type: string
          description: >-
            Format specifies the result set format. Either "legacy" (default) or
            "tabular".
          x-go-name: Format
        matches:
          type: array
          description: >-
            Matches hold the matching events of a filter query in the "legacy"
            result format
          items:
            $ref: '#/components/schemas/Entry'
          x-go-name: Matches
        request:
          $ref: '#/components/schemas/QueryRequest'
        status:
          $ref: '#/components/schemas/Status'
        tables:
          type: array
          description: Tables hold the result tables in the "tabular" result format
          items:
            $ref: '#/components/schemas/Table'
          x-go-name: Tables
      example:
        format: tabular
        status:
          elapsedTime: 260650
          minCursor: 0d8q6stroluyo-07c3957e7400015c-0000c875
          maxCursor: 0d8q6stroluyo-07c3957e7400015c-0000c877
          blocksExamined: 4
          blocksCached: 0
          blocksMatched: 0
          rowsExamined: 197604
          rowsMatched: 197604
          numGroups: 0
          isPartial: false
          cacheStatus: 1
          minBlockTime: '2025-03-26T12:03:14Z'
          maxBlockTime: '2025-03-26T12:12:42Z'
        tables:
          - name: '0'
            sources:
              - name: dataset-name
            fields:
              - name: _sysTime
                type: datetime
              - name: _time
                type: datetime
              - name: content_type
                type: string
              - name: geo.city
                type: string
              - name: geo.country
                type: string
              - name: id
                type: string
              - name: is_tls
                type: boolean
              - name: message
                type: string
              - name: method
                type: string
              - name: req_duration_ms
                type: float
              - name: resp_body_size_bytes
                type: integer
              - name: resp_header_size_bytes
                type: integer
              - name: server_datacenter
                type: string
              - name: status
                type: string
              - name: uri
                type: string
              - name: user_agent
                type: string
              - name: 'is_ok_2    '
                type: boolean
              - name: city_str_len
                type: integer
            order:
              - field: _time
                desc: true
            groups: []
            range:
              field: _time
              start: '1970-01-01T00:00:00Z'
              end: '2025-03-26T12:12:43Z'
            columns:
              - - '2025-03-26T12:12:42.68112905Z'
                - '2025-03-26T12:12:42.68112905Z'
                - '2025-03-26T12:12:42.68112905Z'
              - - '2025-03-26T12:12:42Z'
                - '2025-03-26T12:12:42Z'
                - '2025-03-26T12:12:42Z'
              - - text/html
                - text/plain-charset=utf-8
                - image/jpeg
              - - Ojinaga
                - Humboldt
                - Nevers
              - - Mexico
                - United States
                - France
              - - 8af366cf-6f25-42e6-bbb4-d860ab535a60
                - 032e7f68-b0ab-47c0-a24a-35af566359e5
                - 4d2c7baa-ff28-4b1f-9db9-8e6c0ed5a9c9
              - - false
                - false
                - true
              - - >-
                  QCD permutations were not solvable in linear time, expected
                  compressed time
                - >-
                  QCD permutations were not solvable in linear time, expected
                  compressed time
                - Expected a new layer of particle physics but got a Higgs Boson
              - - GET
                - GET
                - GET
              - - 1.396373193863436
                - 0.16252390534308514
                - 0.4093416175186162
              - - 3448
                - 2533
                - 1906
              - - 84
                - 31
                - 29
              - - DCA
                - GRU
                - FRA
              - - '201'
                - '200'
                - '200'
              - - /api/v1/buy/commit/id/go
                - /api/v1/textdata/cnfigs
                - /api/v1/bank/warn
              - - >-
                  Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0)
                  like Gecko
                - >-
                  Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/535.24 (KHTML,
                  like Gecko) Chrome/19.0.1055.1 Safari/535.24
                - Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))
              - - true
                - true
                - true
              - - 7
                - 8
                - 6
        datasetNames:
          - dataset-name
        fieldsMetaMap:
          dataset-name:
            - name: status
              type: ''
              unit: ''
              hidden: false
              description: HTTP status code
            - name: resp_header_size_bytes
              type: integer
              unit: none
              hidden: false
              description: ''
            - name: geo.city
              type: string
              unit: ''
              hidden: false
              description: the city
            - name: resp_body_size_bytes
              type: integer
              unit: decbytes
              hidden: false
              description: ''
            - name: content_type
              type: string
              unit: ''
              hidden: false
              description: ''
            - name: geo.country
              type: string
              unit: ''
              hidden: false
              description: ''
            - name: req_duration_ms
              type: float
              unit: ms
              hidden: false
              description: Request duration
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: AplResult
    ForbiddenError:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
      example:
        code: 403
        message: Forbidden
    QueryOptions:
      type: object
      properties:
        against:
          type: string
        againstStart:
          type: string
        againstTimestamp:
          type: string
        aggChartOpts:
          type: string
        caseSensitive:
          type: string
        containsTimeFilter:
          type: string
        datasets:
          type: string
        displayNull:
          type: string
        editorContent:
          type: string
        endColumn:
          type: string
        endLineNumber:
          type: string
        endTime:
          type: string
        integrationsFilter:
          type: string
        openIntervals:
          type: string
        quickRange:
          type: string
        resolution:
          type: string
        shownColumns:
          type: string
        startColumn:
          type: string
        startLineNumber:
          type: string
        startTime:
          type: string
        timeSeriesVariant:
          type: string
        timeSeriesView:
          type: string
    Timeseries:
      type: object
      properties:
        series:
          type: array
          items:
            $ref: '#/components/schemas/Interval'
          x-go-name: Series
        totals:
          type: array
          items:
            $ref: '#/components/schemas/EntryGroup'
          x-go-name: Totals
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Timeseries
    DatasetField:
      required:
        - hidden
        - name
        - type
        - unit
      type: object
      properties:
        description:
          type: string
          x-go-name: Description
        hidden:
          type: boolean
          x-go-name: Hidden
        name:
          type: string
          x-go-name: Name
        type:
          type: string
          x-go-name: Type
        unit:
          type: string
          x-go-name: Unit
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: DatasetField
    Entry:
      required:
        - _rowId
        - _sysTime
        - _time
        - data
      type: object
      properties:
        _rowId:
          type: string
          x-go-name: RowID
        _sysTime:
          type: string
          format: date-time
          x-go-name: SysTime
        _time:
          type: string
          format: date-time
          x-go-name: Time
        data:
          type: object
          additionalProperties:
            type: object
            properties: {}
          x-go-name: Data
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Entry
    QueryRequest:
      required:
        - endTime
        - resolution
        - startTime
      type: object
      properties:
        aggregations:
          type: array
          items:
            $ref: '#/components/schemas/Aggregation'
          x-go-name: Aggregations
        continuationToken:
          type: string
          x-go-name: ContinuationToken
        cursor:
          type: string
          x-go-name: Cursor
        endTime:
          type: string
          x-go-name: EndTime
        fieldsMeta:
          type: array
          description: >-
            FieldsMeta contains the unit information (if we have it) for each
            field
          items:
            $ref: '#/components/schemas/DatasetField'
          x-go-name: FieldsMeta
        filter:
          $ref: '#/components/schemas/Filter'
        groupBy:
          type: array
          items:
            type: string
          x-go-name: GroupBy
        includeCursor:
          type: boolean
          x-go-name: IncludeCursor
        limit:
          type: integer
          format: uint32
          x-go-name: Limit
        order:
          type: array
          items:
            $ref: '#/components/schemas/Order'
          x-go-name: Order
        project:
          type: array
          items:
            $ref: '#/components/schemas/Projection'
          x-go-name: Project
        resolution:
          type: string
          description: >-
            The time resolution of the query’s graph, in seconds. Valid values
            are

            the query’s time range /100 at maximum and /1000 at minimum or
            "auto".
          x-go-name: Resolution
        startTime:
          type: string
          description: >-
            start and end time for the query, these must be specified as RFC3339
            strings

            or using relative time expressions (e.g. now-1h, now-1d, now-1w,
            etc)
          x-go-name: StartTime
        virtualFields:
          type: array
          items:
            $ref: '#/components/schemas/VirtualColumn'
          x-go-name: VirtualColumns
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: QueryRequest
    Status:
      required:
        - blocksExamined
        - cacheStatus
        - elapsedTime
        - isPartial
        - maxBlockTime
        - minBlockTime
        - numGroups
        - rowsExamined
        - rowsMatched
      type: object
      properties:
        blocksExamined:
          type: integer
          format: uint64
          x-go-name: BlocksExamined
        cacheStatus:
          type: integer
          format: uint8
          x-go-name: CacheStatus
        continuationToken:
          type: string
          x-go-name: ContinuationToken
        elapsedTime:
          type: integer
          format: int64
          x-go-name: ElapsedTime
        isEstimate:
          type: boolean
          x-go-name: IsEstimate
        isPartial:
          type: boolean
          x-go-name: IsPartial
        maxBlockTime:
          type: string
          format: date-time
          x-go-name: MaxBlockTime
        maxCursor:
          type: string
          description: >-
            Row id of the newest row, as seen server side.

            May be higher than what the results include if the server scanned
            more data than included in the results.

            Can be used to efficiently resume time-sorted non-aggregating
            queries (ie filtering only).
          x-go-name: MaxCursor
        messages:
          type: array
          items:
            $ref: '#/components/schemas/Message'
          x-go-name: Messages
        minBlockTime:
          type: string
          format: date-time
          x-go-name: MinBlockTime
        minCursor:
          type: string
          description: >-
            Row id of the oldest row, as seen server side.

            May be lower than what the results include if the server scanned
            more data than included in the results.

            Can be used to efficiently resume time-sorted non-aggregating
            queries (ie filtering only).
          x-go-name: MinCursor
        numGroups:
          type: integer
          format: uint32
          x-go-name: NumGroups
        rowsExamined:
          type: integer
          format: uint64
          x-go-name: RowsExamined
        rowsMatched:
          type: integer
          format: uint64
          x-go-name: RowsMatched
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Status
    Table:
      required:
        - name
        - sources
        - fields
        - order
        - groups
      title: >-
        Table defines the schema for query results in the "tabular" result
        format.
      type: object
      properties:
        buckets:
          $ref: '#/components/schemas/BucketInfo'
        columns:
          type: array
          description: |-
            Columns contain a series of arrays with the raw result data.
            The columns here line up with the fields in the Fields array.
          items:
            type: array
            items:
              type: object
              properties: {}
          x-go-name: Columns
        fields:
          type: array
          description: >-
            Fields contain information about the fields included in these
            results.

            The order of the fields match up with the order of the data in
            Columns.
          items:
            $ref: '#/components/schemas/FieldInfo'
          x-go-name: Fields
        groups:
          type: array
          description: >-
            Groups specifies which grouping operations has been performed on the
            results.
          items:
            $ref: '#/components/schemas/GroupInfo'
          x-go-name: GroupBy
        name:
          type: string
          description: >-
            Name is the name assigned to this table. Defaults to "0". The name
            "_totals" is reserved for system use.
          x-go-name: Name
        order:
          type: array
          description: Order echoes the ordering clauses that was used to sort the results.
          items:
            $ref: '#/components/schemas/Order'
          x-go-name: Order
        range:
          $ref: '#/components/schemas/RangeInfo'
        sources:
          type: array
          description: >-
            Sources contain the names of the datasets that contributed data to
            these results.
          items:
            $ref: '#/components/schemas/SourceInfo'
          x-go-name: Sources
      description: >-
        The tabular result format can be enabled via APLQueryParams.ResultFormat
        or QueryParams.ResultFormat.
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Table
    Interval:
      required:
        - endTime
        - startTime
      type: object
      properties:
        endTime:
          type: string
          format: date-time
          x-go-name: EndTime
        groups:
          type: array
          items:
            $ref: '#/components/schemas/EntryGroup'
          x-go-name: Groups
        startTime:
          type: string
          format: date-time
          x-go-name: StartTime
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Interval
    EntryGroup:
      required:
        - group
        - id
      type: object
      properties:
        aggregations:
          type: array
          items:
            $ref: '#/components/schemas/EntryGroupAgg'
          x-go-name: Aggregations
        group:
          type: object
          additionalProperties:
            type: object
            properties: {}
          x-go-name: Group
        id:
          type: integer
          format: uint64
          x-go-name: ID
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: EntryGroup
    Aggregation:
      required:
        - field
        - op
      type: object
      properties:
        alias:
          type: string
          x-go-name: Alias
        argument:
          type: object
          properties: {}
          x-go-name: Argument
        field:
          type: string
          x-go-name: Field
        op:
          type: string
          enum:
            - count
            - distinct
            - sum
            - avg
            - min
            - max
            - topk
            - percentiles
            - histogram
            - stdev
            - variance
            - argmin
            - argmax
            - makeset
            - rate
            - makelist
          x-go-name: Op
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Aggregation
    Filter:
      required:
        - field
        - op
      type: object
      properties:
        caseSensitive:
          type: boolean
          description: >-
            Supported for these filters: starts-with, not-starts-with,
            ends-with, not-ends-with, contains, not-contains, eq, ne.
          x-go-name: CaseSensitive
        children:
          type: array
          description: 'Supported for these filters: and, or, not.'
          items:
            type: string
          x-go-name: Children
        field:
          type: string
          x-go-name: Field
        op:
          type: string
          description: >-
            We also support '==', but we’re not exporting that to swagger,
            because it can’t deal with it add >, >=, <, <= to that list, it
            breaks codegen.
          enum:
            - and
            - or
            - not
            - eq
            - '!='
            - ne
            - exists
            - not-exists
            - gt
            - gte
            - lt
            - lte
            - starts-with
            - not-starts-with
            - ends-with
            - not-ends-with
            - contains
            - not-contains
            - regexp
            - not-regexp
          x-go-name: Op
        value:
          type: object
          properties: {}
          x-go-name: Value
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Filter
    Order:
      required:
        - desc
        - field
      type: object
      properties:
        desc:
          type: boolean
          x-go-name: Desc
        field:
          type: string
          x-go-name: Field
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Order
    Projection:
      required:
        - field
      type: object
      properties:
        alias:
          type: string
          x-go-name: Alias
        field:
          type: string
          x-go-name: Field
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Projection
    VirtualColumn:
      required:
        - alias
        - expr
      type: object
      properties:
        alias:
          type: string
          x-go-name: Alias
        expr:
          type: string
          x-go-name: Expr
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: VirtualColumn
    Message:
      required:
        - count
        - msg
        - priority
      type: object
      properties:
        code:
          type: string
          x-go-name: Code
        count:
          type: integer
          format: int64
          x-go-name: Count
        msg:
          type: string
          x-go-name: Msg
        priority:
          type: string
          x-go-name: Priority
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: Message
    BucketInfo:
      required:
        - field
        - size
      title: >-
        BucketInfo captures information about how a grouped query is sorted into
        buckets.
      type: object
      properties:
        field:
          type: string
          description: >-
            Field specifies the field used to create buckets on. Normally this
            would be _time.
          x-go-name: Field
        size:
          type: object
          properties: {}
          description: |-
            An integer or float representing the fixed bucket size.
            When the bucket field is _time this value is in nanoseconds.
          x-go-name: Size
      description: The standard mode of operation is to create buckets on the _time column,
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: BucketInfo
    FieldInfo:
      required:
        - name
        - type
      title: >-
        FieldInfo captures information about a field used in the tabular result
        format. See Table.
      type: object
      properties:
        agg:
          $ref: '#/components/schemas/AggInfo'
        name:
          type: string
          x-go-name: Name
        type:
          type: string
          x-go-name: Type
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: FieldInfo
    GroupInfo:
      title: >-
        GroupInfo captures information about a grouping clause in the tabular
        result format. See Table.
      type: object
      properties:
        name:
          type: string
          x-go-name: Name
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: GroupInfo
    RangeInfo:
      required:
        - field
        - start
        - end
      title: RangeInfo specifies the window a query was restricted to.
      type: object
      properties:
        end:
          type: string
          description: |-
            End is the ending time the query is limited by.
            Queries are restricted to the interval [start,end).
          format: date-time
          x-go-name: End
        field:
          type: string
          description: >-
            Field specifies the field name on which the query range was
            restricted. Normally _time
          x-go-name: Field
        start:
          type: string
          description: |-
            Start is the starting time the query is limited by.
            Queries are restricted to the interval [start,end).
          format: date-time
          x-go-name: Start
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: RangeInfo
    SourceInfo:
      required:
        - name
      title: SourceInfo specifies the provenance of a results Table.
      type: object
      properties:
        name:
          type: string
          x-go-name: Name
      description: >-
        Result sources will typically be the names of a datasets that were
        searched,

        but may be expanded to other things in the future.
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: SourceInfo
    EntryGroupAgg:
      required:
        - op
        - value
      type: object
      properties:
        data:
          type: object
          properties: {}
          x-go-name: Data
        op:
          type: string
          x-go-name: Alias
        value:
          type: object
          properties: {}
          x-go-name: Value
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: EntryGroupAgg
    AggInfo:
      required:
        - name
      type: object
      properties:
        args:
          type: array
          description: >-
            Args specifies any non-field arguments for the aggregation. Fx. [10]
            for topk(players, 10).
          items:
            type: object
            properties: {}
          x-go-name: Args
        fields:
          type: array
          description: >-
            Fields specifies the names of the fields this aggregation is
            computed on.

            Fx ["players"] for topk(players, 10)
          items:
            type: string
          x-go-name: Fields
        name:
          type: string
          description: >-
            Name is the system name of the aggregation, which is the string form
            of aggregation.Type.

            If the aggregation is aliased, the alias is stored in the parent
            FieldInfo
          x-go-name: Name
      description: AggInfo captures information about an aggregation
      x-go-type:
        hints:
          noValidation: true
        import:
          alias: dbdatasets
          package: github.com/axiomhq/axiom/pkg/db/client/swagger/datasets
        type: AggInfo
  securitySchemes:
    Auth:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://accounts.google.com/o/oauth2/v2/auth
          tokenUrl: https://www.googleapis.com/oauth2/v4/token
          scopes:
            CanIngest: Allow ingesting of data
            CanQuery: Allow querying
            CanUpdate: Can update Axiom
            ChangeAccess: >-
              Allow editing of users on this organization, and assigning them
              permissions
            ChangeApiKeys: Allow creating and disabling API keys
            ChangeAuthentication: Allow creating and updating authentication mechanisms
            ChangeDashboards: Allow creating and updating dashboards
            ChangeIntegrations: Allow creating and editing of integrations
            ChangeMonitorsAndNotifiers: Allow creating and editing of monitors and notifiers
            ChangeSavedQueries: Allow creating and updating saved queries
            ChangeVirtualFields: Allow creating and editing virtual fields
            ManageAPITokens: Manage API tokens
            ManageBilling: Manage billing, changing pricing tiers, viewing invoices
            ManageDatasets: Allow editing and deleting of datasets
            ManageEndpoints: >-
              Manage endpoints, changing endpoints, viewing endpoints for
              integrations
            ManageSharedAccessKeys: Manage shared access signing keys
            ViewDashboards: Allow viewing of dashboards
            ViewMonitorsAndNotifiers: Allow viewing of monitors and notifiers
            ViewSavedQueries: Allow viewing of saved queries
            ViewVirtualFields: Allow viewing of virtual fields

````
