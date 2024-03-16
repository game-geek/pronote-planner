--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5
-- Dumped by pg_dump version 16.1 (Ubuntu 16.1-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: feedback_ai_tank_game; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.feedback_ai_tank_game (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    username character varying(50) NOT NULL,
    liked boolean NOT NULL,
    created_at timestamp without time zone,
    feedback character varying(500)
);


ALTER TABLE public.feedback_ai_tank_game OWNER TO admin;

--
-- Name: feedback_ai_tank_game_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.feedback_ai_tank_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_ai_tank_game_id_seq OWNER TO admin;

--
-- Name: feedback_ai_tank_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.feedback_ai_tank_game_id_seq OWNED BY public.feedback_ai_tank_game.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    score integer NOT NULL,
    created_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: feedback_ai_tank_game id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback_ai_tank_game ALTER COLUMN id SET DEFAULT nextval('public.feedback_ai_tank_game_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: feedback_ai_tank_game; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.feedback_ai_tank_game (id, email, username, liked, created_at, feedback) FROM stdin;
1	a@a.com	12321	t	2023-08-28 13:11:59	lol
2	fdfdfd@fdf.c	fd	t	2023-08-28 13:12:59	
4	fdfd@ffdc.d	dfd	f	2023-08-28 13:13:39	fdfd
5	dsds@ds.Co	dsds	t	2023-08-30 12:31:16	dsds
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, password, score, created_at) FROM stdin;
1	barnabas	123456	0	2023-08-28 13:11:53
2	1234	02445e	10	2023-08-28 13:14:31
3	abc	75ff87	53	2023-09-12 13:31:09
4	isaac	0c51ae	7	2023-09-12 13:34:15
5	Kyucros	655f89	0	2023-09-13 16:28:39
6	Theo	90291a	0	2023-09-13 16:37:15
7	aaaaaaaa	d88e75	0	2023-09-13 18:13:36
8	igor	be775d	0	2023-09-14 11:53:10
9	ass	bc007a	0	2023-09-20 02:32:23
10	esrtiu	618a39	18	2023-09-20 06:52:20
11	asdf	6792d5	0	2023-09-22 00:13:14
12	fabrice	98e600	0	2023-09-28 10:51:47
13	ghost	eea2e9	0	2023-10-01 14:14:45
14	Pierre	cdbc90	0	2023-10-03 12:42:36
15	jj	de3724	0	2023-10-06 04:48:18
16	olo	1a8c91	0	2023-10-06 04:48:19
17	david	27f12f	0	2023-10-06 15:47:36
18	bob	f5ec3f	11	2023-10-07 10:39:46
20	nsi	562191	0	2023-10-09 13:47:59
19	ffff	5ede4c	40	2023-10-09 13:46:24
21	sandrine	8d67ca	0	2023-10-09 14:18:21
22	45	0db410	0	2023-10-09 14:18:21
23	tete	172866	0	2023-10-09 15:50:39
24	MAtt	290f83	0	2023-10-11 06:19:54
25	Matt	c4dd2d	0	2023-10-11 06:20:17
26	hugo	b3b7ad	0	2023-10-12 10:26:32
27	Sacha	9f09d3	0	2023-10-12 11:07:38
28	123456789	3b8446	0	2023-10-17 06:14:06
29	yooooooo	074c6a	0	2023-10-17 06:23:55
30	knnlk	1657f7	0	2023-10-17 06:24:26
31	165747	41d2df	42	2023-10-17 06:24:49
32	nUEHFf	8176aa	0	2023-10-17 06:29:07
33	jfdqhvruhgfoirduqhfe	8350c6	0	2023-10-17 06:29:14
34	lujiode	a6a836	0	2023-10-17 06:29:22
35	killohjou08972	3fd9d0	0	2023-10-17 06:29:41
37	May	84e90f	0	2023-10-17 07:11:36
36	ahsa	f6c4e6	34	2023-10-17 07:11:00
38	may	61d32e	0	2023-10-17 07:12:23
39	nigger	543bbe	0	2023-10-17 07:12:46
40	hd	d16e5c	6	2023-10-17 07:13:00
41	hfogd	4b9793	0	2023-10-17 07:13:42
42	djnjz	c2092d	0	2023-10-17 07:47:46
43	br	5f1d1c	0	2023-10-18 06:56:36
44	aa	4c0bd4	0	2023-10-18 16:36:24
45	tom	5ef7e0	0	2023-10-19 09:39:07
46	ujjj	7972dc	101	2023-10-19 11:29:52
47	omagad	91b663	0	2023-10-19 12:33:49
48	fdfdfdfff	31bd94	49	2023-10-19 12:33:49
49	mpmp	ed4f87	0	2023-10-19 12:50:37
50	Lou_Tbl	2d009f	0	2023-10-20 08:42:31
51	LouTbl	f3cf85	0	2023-10-20 08:54:21
52	michel	d7a88a	0	2023-10-20 08:55:28
53	jules	893432	0	2023-10-21 14:50:11
54	vvfv	e92ff4	0	2023-10-21 14:50:11
55	vrfdvf	8b7603	0	2023-10-21 14:50:11
56	vrbrbr	51f0e4	91	2023-10-21 14:50:11
57	LOULALI	82c22e	92	2023-10-22 19:29:07
58	baptiste	f6ab40	0	2023-10-31 17:24:31
59	baptisteeee	77c7d5	79	2023-10-31 17:24:31
60	osama	15fcf2	0	2023-11-06 12:04:46
61	osamabin	775b11	0	2023-11-06 12:05:33
62	jackie	00b2ab	0	2023-11-07 08:45:56
63	JANNOT	397b88	0	2023-11-07 08:47:04
64	fred	326883	32	2023-11-07 14:24:51
65	anto	482785	0	2023-11-07 14:28:49
66	n1gg3r	f28f0a	294	2023-11-07 23:21:04
67	kinou	a7fe3b	0	2023-11-08 13:40:29
68	Xela	775c65	0	2023-11-13 14:49:08
69	tit	4610e9	0	2023-11-13 16:16:28
70	potat	2861fc	29	2023-11-15 02:14:23
71	angi	24cbe8	0	2023-11-16 08:45:45
72	Nifa	111ae6	0	2023-11-16 08:45:45
73	caca	f41849	0	2023-11-16 17:03:20
74	OUIEITD	b14e86	0	2023-11-16 17:04:26
75	fran	301995	65	2023-11-17 12:51:23
76	test	f500f1	34	2023-11-17 18:27:31
77	dddd	110a79	0	2023-11-18 10:53:21
78	axel	beed3c	0	2023-11-20 12:12:08
79	didi	6f3b58	0	2023-11-20 12:12:51
80	dims	4f6a7f	0	2023-11-20 21:08:27
81	fdze	b0f71e	0	2023-11-23 10:39:28
82	hyt	9a06b2	0	2023-11-23 10:40:18
83	ter	d92024	0	2023-11-23 10:40:56
84	terter	5ec622	0	2023-11-23 10:41:06
85	test123456	756169	4	2023-11-23 12:45:54
86	toto	9bceea	0	2023-11-23 22:24:11
87	Florian	8056f8	0	2023-11-24 08:25:19
88	lol	0a86a6	15	2023-11-24 18:32:44
89	mflv	b8fb7b	0	2023-11-24 18:34:16
90	moa	826a30	0	2023-11-27 10:46:52
91	moi	5e7c82	0	2023-11-27 10:47:16
92	augustin	d1b69c	0	2023-11-27 10:52:03
93	augusken	a78e3b	0	2023-11-27 10:52:30
94	chibrax	77527d	0	2023-11-28 08:53:12
95	eaeaez	084827	249	2023-11-28 15:37:32
96	kox	d60f00	0	2023-11-28 17:14:05
97	cokakola	144092	0	2023-12-01 10:29:02
98	kokakola	60739a	0	2023-12-01 10:29:17
99	kkokakala	66c1eb	0	2023-12-01 10:29:49
100	kokakolaa	006ce6	0	2023-12-01 10:31:05
101	PJ64	e22266	0	2023-12-01 15:46:58
102	mario	58a59c	0	2023-12-04 10:19:51
103	oiefj	f7b899	0	2023-12-04 10:20:07
104	ytc	f5db47	0	2023-12-04 10:20:20
105	Joseph_DBH	42e541	0	2023-12-04 14:08:54
106	jojopo	bce338	0	2023-12-04 14:13:02
107	joseph_dbh	3f1d10	0	2023-12-04 14:13:14
108	Joseph.dbh	72f6d6	0	2023-12-04 14:13:56
109	Oui	b3288f	0	2023-12-04 14:14:49
110	bgdu94	099c8d	0	2023-12-06 09:58:28
111	bfddddddd	ab36a4	0	2023-12-06 15:45:37
112	bvc	8696e3	15	2023-12-06 15:45:37
113	ines	89de7b	0	2023-12-07 10:45:57
114	rejgrjg	9013dd	15	2023-12-07 10:46:17
115	azov	09f597	0	2023-12-12 14:01:54
117	ffrdq	91071f	0	2023-12-12 16:55:20
118	natheo	374c8a	0	2023-12-12 16:55:47
119	cmoiwsh	800202	729	2023-12-18 12:38:08
116	tje	f06ff3	244	2023-12-12 14:03:58
120	noemie	57ebfa	0	2023-12-18 13:16:43
121	noemie.a.a	5b4e82	0	2023-12-18 13:17:19
122	Luka	c31d9d	254	2023-12-18 20:42:49
123	quentin	b9d5f8	0	2023-12-19 13:14:45
124	quentin148748	dc5f46	0	2023-12-19 13:15:07
125	alex	dcd38f	61	2023-12-19 16:30:51
126	ratio	2bbef4	0	2023-12-20 08:49:15
128	DS	c50353	0	2024-01-08 19:33:46
127	trst553df	5b109e	49	2024-01-08 19:29:18
129	OIPO	5444eb	0	2024-01-08 19:34:09
130	56565	f74e3f	0	2024-01-11 07:50:07
131	khgkuhkj	9816b1	0	2024-01-15 16:14:35
132	pumpking	1fd2fe	0	2024-01-22 07:34:21
133	mamadou	d70457	0	2024-01-29 08:00:11
134	okgoogle	b6b441	73	2024-01-29 08:00:18
135	Ghosty	04fb3c	0	2024-02-06 08:19:01
136	Hamza	20d9c7	7	2024-02-06 08:20:59
137	bliwox	8d5191	0	2024-02-08 10:49:49
138	dujdudjzdjzkod	24f1c7	0	2024-02-08 10:50:04
139	Aizen_416	7f4b52	0	2024-02-09 07:53:19
140	Aizen416	f3cada	0	2024-02-09 07:53:56
141	Driss	7774bf	30	2024-02-12 10:33:23
142	jette	cf371c	0	2024-02-12 10:35:38
143	gold	2d2158	21	2024-02-12 10:36:58
144	Neele	ec2f11	44	2024-02-12 10:38:00
145	dsojkslmds	5fee94	21	2024-02-12 11:48:43
\.


--
-- Name: feedback_ai_tank_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.feedback_ai_tank_game_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 145, true);


--
-- Name: feedback_ai_tank_game feedback_ai_tank_game_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback_ai_tank_game
    ADD CONSTRAINT feedback_ai_tank_game_email_key UNIQUE (email);


--
-- Name: feedback_ai_tank_game feedback_ai_tank_game_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.feedback_ai_tank_game
    ADD CONSTRAINT feedback_ai_tank_game_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

