--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
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
146	qfdbvwxvxcv	9f0a97	0	2024-02-12 15:45:39
147	hjj	0f0147	0	2024-02-13 04:56:32
148	Ilian	26e5f4	487	2024-02-13 08:32:41
149	jlkhuji	6a8aa9	0	2024-02-13 13:46:37
150	aaa	4d2af9	0	2024-02-13 13:47:01
151	kuyyiy	270645	0	2024-02-13 14:09:01
153	RVS	bf335e	0	2024-02-15 12:40:20
152	pomah	edf2bc	34	2024-02-15 12:40:07
154	jkjjj	d1d9a1	0	2024-02-15 13:03:43
155	Sorky	416a68	0	2024-02-15 14:30:11
156	test2024	065a32	0	2024-02-15 14:44:29
157	test_2024_mohamedal	a46220	0	2024-02-15 14:45:46
158	test_2024_mohamed	d56c5c	0	2024-02-15 14:46:04
159	skyfrix	5caecc	0	2024-02-16 12:34:40
160	plop	ce2936	0	2024-02-19 06:45:45
161	aaaaa	2ab648	0	2024-02-19 08:50:48
162	ntm	ed1f0e	0	2024-02-20 13:18:26
163	momo	37cff7	0	2024-02-20 13:18:40
164	fezGIUPIUHPQGREZ	dd92e7	0	2024-02-20 13:18:43
249	fabien	400c71	0	2024-03-29 05:03:29
165	eeeeeee	7a0f5d	37	2024-02-20 13:18:50
236	Youyou	a83d32	114	2024-03-21 13:53:12
166	Truc	0317b4	33	2024-02-21 16:11:43
167	toolkik	8b832f	0	2024-02-22 06:26:53
168	juju	765fc5	0	2024-02-22 13:23:48
169	yuutjh	9d6aa4	23	2024-02-22 19:04:00
170	Goldou	8d03b2	0	2024-02-22 21:43:36
171	Tagrandmere	5d9803	0	2024-02-22 21:43:45
172	tettet	f6318c	29	2024-02-23 13:17:42
173	ee	bbe2c1	0	2024-02-24 13:32:44
174	hadena	f2d8ee	0	2024-02-26 10:43:43
175	jojoj	ea5481	0	2024-02-26 10:44:05
237	nig	c6eeb4	0	2024-03-21 14:25:24
176	gabrielphan	9f25c1	82	2024-02-27 05:39:46
177	vhjk	6c36df	0	2024-02-28 10:29:41
178	tyron	0e1f6f	0	2024-02-29 01:12:19
179	horshimahlou	3d3bb6	0	2024-02-29 08:04:30
180	Carl	eb90b8	0	2024-03-01 07:37:34
181	ipalom	e886b6	0	2024-03-01 08:33:20
182	vadim	224b32	0	2024-03-01 08:45:03
183	gbgb	ab9c29	0	2024-03-01 10:17:35
184	ode	bb3bc8	0	2024-03-02 10:41:02
185	ofd	79a7ea	0	2024-03-02 10:41:39
186	ll	bb8d73	0	2024-03-02 10:42:21
187	lisanalgaib	440eb4	161	2024-03-04 07:39:44
188	alice	26be6b	0	2024-03-04 09:38:26
189	bruh	390609	0	2024-03-04 16:45:55
190	uuhfhdud	b728fc	0	2024-03-04 16:46:33
191	redkill1122	4a5da2	0	2024-03-04 16:46:49
192	mirtui919	c524de	0	2024-03-04 16:47:09
193	sao	3e2ff3	0	2024-03-05 05:08:23
194	BOMBOCLATA	109806	108	2024-03-05 07:22:54
195	n	8a88b3	0	2024-03-05 13:48:41
238	er	dbb716	0	2024-03-21 14:25:53
196	HTM785	7b9ad2	45	2024-03-05 13:52:18
197	katiesigmond	254329	0	2024-03-06 08:30:21
198	jadee	5189d6	0	2024-03-06 08:31:59
199	fefdsf	6a7258	0	2024-03-06 19:29:28
200	sd	6e6bce	0	2024-03-07 06:52:55
201	yopo	64bd2d	0	2024-03-08 11:12:17
202	mux	d3f663	0	2024-03-08 11:32:38
203	azertyuiop	b3897e	0	2024-03-08 12:41:33
204	Pablo	14be90	0	2024-03-08 12:42:49
205	AZERTYUIOP	06a477	0	2024-03-08 12:42:53
206	Connasse	b37619	0	2024-03-08 12:43:31
207	Tomatochip001	a5cdca	0	2024-03-10 09:21:58
208	ernre	9e82b2	0	2024-03-10 16:26:25
209	salut	a7b2de	21	2024-03-10 16:26:36
210	llm	62763d	0	2024-03-11 12:39:20
211	LouXys36	61607c	0	2024-03-11 12:47:22
212	eafkzfkzfj	95a41d	0	2024-03-11 12:47:32
213	eefsf	f4cf9c	0	2024-03-11 12:47:34
214	efsfsd	c07eaa	0	2024-03-11 12:47:36
215	Lousisi	a47f80	0	2024-03-11 12:48:03
216	Fqceless_One	68d564	0	2024-03-11 13:22:16
217	nigga	1aad18	0	2024-03-13 12:58:24
218	gg	de2954	0	2024-03-14 11:09:22
219	dudz	3f3d6e	0	2024-03-14 11:15:44
220	soso	8eba79	0	2024-03-14 12:38:06
221	lorenzo	48ed23	0	2024-03-14 12:38:36
222	sosolabest	83d4e1	0	2024-03-14 12:38:58
223	kk	1d802f	7	2024-03-15 15:00:38
224	Bananacolada	80b5c2	0	2024-03-17 11:38:35
225	zob	3eff87	0	2024-03-18 07:51:55
226	avaleur_de_foutre	ce3ce3	0	2024-03-18 08:42:11
227	quoicoubeh	6c70cf	0	2024-03-18 09:48:19
228	pgmz65310	6a8ae8	0	2024-03-18 09:49:22
229	CACA	7c0baa	0	2024-03-18 15:21:18
230	eeffv	a4bfad	0	2024-03-18 15:21:26
231	furieux	380ee9	0	2024-03-18 15:21:42
232	lulu	42a65c	0	2024-03-18 15:24:12
233	nfkn	8f6b92	0	2024-03-19 09:17:19
234	coco	7a9272	0	2024-03-19 09:17:19
235	salot	3342fc	0	2024-03-19 10:35:57
250	Kebabheros	89833c	0	2024-04-04 06:52:04
239	aurel	ec0134	0	2024-03-21 14:26:04
251	gzdz	301126	0	2024-04-04 12:33:25
240	thisisatest	5f6735	73	2024-03-24 17:24:54
241	poiuytreza	9a3fc5	0	2024-03-25 09:50:19
242	zizi	3aec3c	0	2024-03-26 08:34:50
243	abgh	9b594e	0	2024-03-26 08:35:05
244	carpeplume	724586	0	2024-03-26 08:35:16
245	jojo	abadc6	0	2024-03-27 08:38:24
246	boby	defbbe	0	2024-03-27 08:53:23
247	me	010843	0	2024-03-27 08:59:03
248	0mkiugk	1bd2f0	0	2024-03-27 08:59:24
252	befdvndvc	0b16ec	0	2024-04-04 12:33:25
253	arthur	c8b24c	0	2024-04-04 12:33:25
254	arrthur	ee5734	0	2024-04-04 12:33:40
255	ddqzdz	2ca48b	0	2024-04-05 13:39:09
256	qdzq	d28b9d	0	2024-04-05 13:39:10
257	dqzd	1eb8f8	0	2024-04-05 13:39:10
258	aether0802	7ed94e	0	2024-04-05 13:39:10
259	arther	92c4c5	0	2024-04-05 13:39:10
260	jkip	1bae1c	29	2024-04-06 12:09:28
261	esrr	1aff2c	19	2024-04-10 13:17:27
262	vbn	6409e5	0	2024-04-15 16:01:13
263	ssssss	c365e0	0	2024-04-18 12:14:02
264	wewety	614a75	25	2024-04-21 19:29:25
265	yourgay	a98c81	0	2024-04-25 09:28:39
266	nahim	7cbe7f	0	2024-04-29 07:58:43
267	adel	4079c4	0	2024-04-29 07:58:44
268	adelnahim	3e6b5e	0	2024-04-29 07:59:28
269	hello	b1fe68	30	2024-04-29 18:35:09
270	baba	8530d9	44	2024-05-01 14:25:04
271	lo	fefab6	0	2024-05-02 19:28:06
272	tof	61f8e7	0	2024-05-03 19:07:43
273	Brewen	46f440	0	2024-05-06 12:31:50
\.


--
-- Name: feedback_ai_tank_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.feedback_ai_tank_game_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 273, true);


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

